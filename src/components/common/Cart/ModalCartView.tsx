import { DialogDescription } from '@radix-ui/react-dialog';
import { Minus, Plus, Trash } from 'lucide-react';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import {
  useCartItemsQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from '@/services/v1/cart';

export function ModalCartView({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: cartItems, isLoading, isError, refetch } = useCartItemsQuery();
  const { mutate: updateCartItemMutation } = useUpdateCartItemMutation();
  const { mutate: deleteCartItemMutation } = useDeleteCartItemMutation();

  useEffect(() => {
    if (open) {
      void refetch();
    }
  }, [open, refetch]);

  // Función para cambiar la cantidad
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast({
        title: 'Cantidad no válida',
        description: 'La cantidad mínima es 1',
      });
      return;
    }

    updateCartItemMutation(
      { cartItemId: itemId, quantity: newQuantity },
      {
        onSuccess: () => {
          toast({
            title: 'Cantidad actualizada',
            description:
              'La cantidad del producto se ha actualizado correctamente',
          });
          void refetch();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message ||
            'Ocurrió un error al actualizar el producto';
          toast({
            title: 'Error al actualizar',
            description: message,
          });
        },
      },
    );
  };

  // Función para eliminar un producto
  const deleteItem = (itemId: number) => {
    deleteCartItemMutation(
      { cartItemId: itemId },
      {
        onSuccess: () => {
          toast({
            title: 'Producto eliminado',
            description: 'El producto se ha eliminado del carrito',
          });
          void refetch();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message ||
            'Ocurrió un error al eliminar el producto';
          toast({
            title: 'Error al eliminar',
            description: message,
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogContent className="w-full max-w-md p-6 md:p-10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Carrito de compras
          </DialogTitle>
          <DialogDescription>
            {isLoading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : isError ? (
              <p className="text-sm text-red-500">
                Error al cargar los productos.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                {cartItems?.length
                  ? 'Gestiona los productos en tu carrito.'
                  : 'No hay productos en el carrito.'}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {!isLoading &&
            !isError &&
            cartItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Precio: ${item.product.price}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                  >
                    <Minus size={16} />
                  </Button>
                  <p className="px-2 text-lg font-semibold">{item.quantity}</p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      deleteItem(item.id);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cerrar
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
