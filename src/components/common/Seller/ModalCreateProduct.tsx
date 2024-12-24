import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ProductResponse } from '@/schemas/product';
import {
  useCreateProductMutation,
  useProductByIdQuery,
  useUpdateProductMutation,
} from '@/services/v1/products';

// Validation schema
const formSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del producto es obligatorio')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  sku: z
    .string()
    .min(1, 'El SKU es obligatorio')
    .regex(
      /^[A-Za-z0-9-]+$/,
      'El SKU debe ser alfanumérico y puede contener guiones',
    ),
  quantity: z
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .min(1, 'La cantidad debe ser al menos 1'),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0.01, 'El precio debe ser mayor a 0'),
});

export function ModalCreateProduct({
  open,
  setOpen,
  setCurrentProduct,
  productId,
  refetch,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentProduct: React.Dispatch<
    React.SetStateAction<ProductResponse | null>
  >;
  productId?: string;
  refetch: () => void;
}) {
  const isEditing = !!productId;

  const { data: product, isLoading: productIsLoading } = useProductByIdQuery(
    isEditing ? productId.toString() : '',
  );

  const { mutate: createProductMutation, isLoading } =
    useCreateProductMutation();

  const { mutate: updateProductMutation, isLoading: updateProductIsLoading } =
    useUpdateProductMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      quantity: 1,
      price: 0,
    },
  });

  useEffect(() => {
    form.reset({
      name: '',
      sku: '',
      quantity: 1,
      price: 0,
    });
  }, [form]);

  useEffect(() => {
    if (isEditing && product) {
      form.reset({
        name: product.name || '',
        sku: product.sku || '',
        quantity: product.quantity || 1,
        price: product.price || 0,
      });
    } else {
      form.reset({
        name: '',
        sku: '',
        quantity: 1,
        price: 0,
      });
    }
  }, [product, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing) {
      updateProductMutation(
        {
          id: productId ? parseInt(productId) : 0,
          ...values,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Producto actualizado',
              description: 'El producto se ha actualizado correctamente',
            });

            form.reset();
            setOpen(false);
            setCurrentProduct(null);
            refetch();
          },

          onError(error: any, variables, context) {
            switch (error.response?.status) {
              case 400:
                toast({
                  title: 'Error al actualizar producto',
                  description: error.response.data.message,
                });
                break;
              default:
                toast({
                  title: 'Error al actualizar producto',
                  description: 'Ocurrió un error inesperado',
                });
                break;
            }
          },
        },
      );
    } else {
      createProductMutation(values, {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          setCurrentProduct(null);
          refetch();
        },

        onError(error: any, variables, context) {
          switch (error.response?.status) {
            case 400:
              toast({
                title: 'Error al crear producto',
                description: error.response.data.message,
              });
              break;
            default:
              toast({
                title: 'Error al crear producto',
                description: 'Ocurrió un error inesperado',
              });
              break;
          }
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setCurrentProduct(null);
        form.reset({
          name: '',
          sku: '',
          quantity: 1,
          price: 0,
        }); // Restablece los valores predeterminados
      }}
    >
      <DialogContent className="w-full p-10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Crear Producto
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Precio"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex justify-end gap-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset(); // Limpia los valores del formulario
                      setCurrentProduct(null); // Limpia el producto actual
                    }}
                  >
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primaryVariant-surface-default hover:bg-primaryVariant-surface-dark focus:ring-primaryVariant-surface-dark text-greyScale-text-negative hover:text-greyScale-text-negative focus:text-greyScale-text-negative"
                >
                  {isLoading || updateProductIsLoading || productIsLoading
                    ? 'Creando...'
                    : isEditing
                      ? 'Actualizar'
                      : 'Crear'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
