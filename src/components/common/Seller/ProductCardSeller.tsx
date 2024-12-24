import { Pencil, Trash } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { ProductResponse } from '@/schemas/product';

const ProductCardSeller = ({
  product,
  onDelete,
  onEdit,
  refetch,
}: {
  product: ProductResponse;
  onDelete: () => void;
  onEdit: () => void;
  refetch: () => void;
}) => {
  return (
    <div
      className="border p-4 rounded-lg shadow-sm flex justify-between items-center relative w-full max-w-md"
      style={{ minHeight: '150px' }}
    >
      <div>
        <h3 className="text-base font-semibold">
          {product.name.length > 10
            ? `${product.name.slice(0, 15)}...`
            : product.name}
        </h3>

        <p className="text-xs text-gray-500 truncate" title={product.sku}>
          SKU: {product.sku}
        </p>
        <p className="text-xs text-gray-700">${product.price}</p>
        <p className="text-xs text-gray-700">{product.quantity} disponibles</p>
      </div>
      <div className="flex flex-col gap-2 absolute right-4 top-4">
        <Button
          size="icon"
          onClick={() => {
            onDelete();
            refetch();
          }}
          className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent"
          aria-label={`Eliminar producto ${product.name}`}
        >
          <Trash className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          className="text-green-400 hover:text-green-700 bg-transparent hover:bg-transparent"
          onClick={onEdit}
        >
          <Pencil className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCardSeller;
