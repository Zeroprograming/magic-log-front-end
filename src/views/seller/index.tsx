import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { ModalCreateProduct } from '@/components/common/Seller/ModalCreateProduct';
import ProductCardSeller from '@/components/common/Seller/ProductCardSeller';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ProductResponse } from '@/schemas/product';
import {
  useDeleteProductMutation,
  useProductsQuery,
} from '@/services/v1/products';
import { getCurrentUser } from '@/store/selectors/user';

const formSchema = z.object({
  name: z.string().optional(), // Filtro de nombre del producto
  sku: z.string().optional(), // Filtro de SKU
  quantity: z.number().optional(), // Filtro de cantidad
  priceMin: z.number().optional(), // Filtro de precio mínimo
  priceMax: z.number().optional(), // Filtro de precio máximo
  userId: z.number().optional(), // Filtro de ID de usuario
  createdAtFrom: z.date().optional(), // Filtro de fecha de creación desde
  createdAtTo: z.date().optional(), // Filtro de fecha de creación hasta
});

export default function SellerView() {
  const user = useSelector(getCurrentUser);
  const [page, setPage] = useState(1);
  const [openModalCreateUpdateProduct, setOpenModalCreateUpdateProduct] =
    useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductResponse | null>(
    null,
  );

  const [filters, setFilters] = useState({
    name: { value: '' as string | null },
    sku: { value: '' as string | null },
    priceMin: { value: null as number | null },
    priceMax: { value: null as number | null },
    createdAtFrom: { value: null as Date | null },
    createdAtTo: { value: null as Date | null },
  });

  const {
    data: dataProducts,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery({
    name: filters.name.value ?? undefined,
    sku: filters.sku.value ?? undefined,
    priceMin: filters.priceMin.value ?? undefined,
    priceMax: filters.priceMax.value ?? undefined,
    createdAtFrom: filters.createdAtFrom.value ?? undefined,
    createdAtTo: filters.createdAtTo.value ?? undefined,
    userIds: [user?.id],
    limit: 10,
    page,
  });

  // Cálculos de paginación
  const totalPages = dataProducts?.metadata?.last_page ?? 1;
  const currentPage = dataProducts?.metadata?.current_page ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return; // No cambiar página si es inválida
    setPage(newPage);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      priceMin: 0,
      priceMax: 0,
      createdAtFrom: undefined,
      createdAtTo: undefined,
    },
  });

  const { setValue, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, sku, priceMin, priceMax, createdAtFrom, createdAtTo } = data;

    setFilters({
      name: { value: name ?? null },
      sku: { value: sku ?? null },
      priceMin: { value: priceMin ?? null },
      priceMax: { value: priceMax ?? null },
      createdAtFrom: { value: createdAtFrom ?? null },
      createdAtTo: { value: createdAtTo ?? null },
    });

    void refetch();
  };

  const DeleteProductMutation = useDeleteProductMutation();

  const handleDeleteProduct = async (id: number) => {
    DeleteProductMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Producto eliminado',
          description: 'El producto ha sido eliminado correctamente',
        });
      },
      onError: (error: any) => {
        switch (error.response?.status) {
          case 400:
            toast({
              title: 'Error al eliminar producto',
              description: error.response.data.message,
            });
            break;
          default:
            toast({
              title: 'Error al eliminar producto',
              description: 'Ocurrió un error inesperado',
            });
            break;
        }
      },
    });

    await refetch();
  };

  return (
    <>
      <div className="flex flex-row gap-3 justify-center items-center w-screen max-w-screen-xl">
        {/* Filtros */}
        <div className="w-1/4 p-6 mb-10 bg-white rounded-lg h-screen max-h-[80vh]">
          <h2 className="text-xl font-semibold">Filtros de Productos</h2>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col w-full gap-6">
                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del producto</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU del producto</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fecha Desde */}
                <FormField
                  control={form.control}
                  name="createdAtFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Creación Desde</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP', { locale: es })
                              : 'Desde'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              setValue('createdAtFrom', date);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                {/* Fecha Hasta */}
                <FormField
                  control={form.control}
                  name="createdAtTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Creación Hasta</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP', { locale: es })
                              : 'Hasta'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              setValue('createdAtTo', date);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                {/* Botón de aplicar filtros */}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-primaryVariant-surface-default text-greyScale-text-negative"
                >
                  Aplicar filtros
                </Button>

                {/* Botón de limpiar filtros */}
                <Button
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
                  className="w-full mt-2 bg-greyScale-text-body text-greyScale-text-negative"
                >
                  Limpiar filtros
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Lista de productos */}
        <div className="w-3/4 p-6 mb-10 bg-white rounded-lg h-screen max-h-[80vh] flex flex-col justify-between">
          {/* Filtro de nombre dentro de la lista de productos */}
          <div className="mb-6 pb-4 flex flex-col gap-4">
            <h2 className="w-full text-start text-xl font-semibold">
              Inventario
            </h2>

            <div className="flex flex-row justify-between items-center w-full">
              <Button
                className="bg-primaryVariant-surface-default text-greyScale-text-negative"
                onClick={() => {
                  setCurrentProduct(null);
                  setOpenModalCreateUpdateProduct(true);
                }}
              >
                Crear producto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[75vh] overflow-y-auto justify-start items-start h-full">
            {isLoading && (
              <p className="col-span-full text-center text-gray-500">
                Cargando...
              </p>
            )}

            {!isLoading && isError && (
              <p className="col-span-full text-center text-red-500 font-semibold text-xl">
                Error al cargar los productos.
              </p>
            )}

            {!isLoading && !isError && dataProducts?.products?.length === 0 && (
              <div className="col-span-full flex flex-col justify-center items-center">
                <p className="text-center text-gray-600 text-xl font-semibold">
                  No hay productos disponibles.
                </p>

                <Button
                  className="bg-primaryVariant-surface-default text-greyScale-text-negative mt-4"
                  onClick={() => {
                    setOpenModalCreateUpdateProduct(true);
                  }}
                >
                  Crear producto
                </Button>
              </div>
            )}

            {!isLoading &&
              !isError &&
              dataProducts?.products &&
              dataProducts.products.length > 0 &&
              dataProducts.products.map((product) => (
                <ProductCardSeller
                  key={product.id}
                  product={product}
                  onDelete={async () => {
                    await handleDeleteProduct(product.id);
                  }}
                  onEdit={() => {
                    setCurrentProduct(product);
                    setOpenModalCreateUpdateProduct(true);
                  }}
                  refetch={refetch}
                />
              ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      handlePageChange(currentPage - 1);
                    }}
                    className="cursor-pointer"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, pageNumber) => (
                  <PaginationItem key={pageNumber + 1}>
                    <PaginationLink
                      isActive={pageNumber + 1 === currentPage}
                      onClick={() => {
                        handlePageChange(pageNumber + 1);
                      }}
                      className="cursor-pointer"
                    >
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      handlePageChange(currentPage + 1);
                    }}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <ModalCreateProduct
        open={openModalCreateUpdateProduct}
        setOpen={setOpenModalCreateUpdateProduct}
        setCurrentProduct={setCurrentProduct}
        productId={currentProduct?.id.toString()}
        refetch={refetch}
      />
    </>
  );
}
