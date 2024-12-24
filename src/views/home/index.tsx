import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/components/ui/use-toast';
import { useCreateCartItemMutation } from '@/services/v1/cart';
import { useProductsQuery } from '@/services/v1/products';

const formSchema = z.object({
  name: z.string().optional(), // Filtro de nombre del producto
  sku: z.string().optional(), // Filtro de SKU
  quantity: z.number().optional(), // Filtro de cantidad
  priceMin: z.number().optional(), // Filtro de precio mínimo
  priceMax: z.number().optional(), // Filtro de precio máximo
});

export default function HomeView() {
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    name: { value: '' as string | null },
    sku: { value: '' as string | null },
    priceMin: { value: 0 as number | null },
    priceMax: { value: 0 as number | null },
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
    limit: 10,
    page,
  });

  const CreateCartItemMutation = useCreateCartItemMutation();

  const handleAddToCart = async (productId: number) => {
    CreateCartItemMutation.mutate(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Producto agregado al carrito',
            description: 'El producto se ha agregado al carrito correctamente.',
          });
        },
        onError: (error: any) => {
          switch (error.response?.status) {
            case 400:
              toast({
                title: 'Error al agregar producto al carrito',
                description: error.response?.data?.message,
              });
              break;
            default:
              toast({
                title: 'Error al agregar producto al carrito',
                description: error.response?.data?.message,
              });
              break;
          }
        },
      },
    );
  };

  // Cálculos de paginación
  const totalPages = dataProducts?.metadata?.last_page ?? 1;
  const currentPage = dataProducts?.metadata?.current_page ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 ?? newPage > totalPages) return; // No cambiar página si es inválida
    setPage(newPage);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      priceMin: 0,
      priceMax: 0,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, sku, priceMin, priceMax } = data;

    setFilters({
      name: { value: name ?? null },
      sku: { value: sku ?? null },
      priceMin: { value: priceMin ?? null },
      priceMax: { value: priceMax ?? null },
    });
    void refetch();
  };

  return (
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
              {/* Precio Mínimo */}
              <FormField
                control={form.control}
                name="priceMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Precio Mínimo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Precio Máximo */}
              <FormField
                control={form.control}
                name="priceMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Máximo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Precio Máximo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
        <div className="mb-6 pb-4">
          <h2 className="w-full text-end text-xl font-semibold">Productos</h2>

          <h3 className="mb-2">Filtrar por nombre</h3>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Filtrar por nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Mostrar productos o mensaje de no hay productos */}
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
            </div>
          )}

          {!isLoading &&
            !isError &&
            dataProducts?.products &&
            dataProducts.products.length > 0 &&
            dataProducts.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {
                  void handleAddToCart(product.id);
                }}
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
  );
}
