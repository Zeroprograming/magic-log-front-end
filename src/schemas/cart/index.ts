export interface ICartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
}

export interface CartResponseList {
  id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product: {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    price: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
  };
}

export interface CreateCartItemData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  cartItemId: number;
  quantity: number;
}

export interface DeleteCartItemData {
  cartItemId: number;
}
