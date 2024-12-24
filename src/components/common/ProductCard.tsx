import { ShoppingCart } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { ProductResponse } from '@/schemas/product';

const ProductCard = ({
  product,
  onAddToCart,
}: {
  product: ProductResponse;
  onAddToCart: () => void;
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
          onClick={onAddToCart}
          className="text-blue-500 hover:text-blue-700 bg-transparent hover:bg-transparent"
          aria-label={`Agregar producto ${product.name} al carrito`}
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
