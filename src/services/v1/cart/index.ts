import { useMutation, useQuery } from 'react-query';

import { axiosClient } from '@/api/axios_client';
import {
  CartResponseList,
  CreateCartItemData,
  DeleteCartItemData,
  ICartItem,
  UpdateCartItemData,
} from '@/schemas/cart/index';

// Fetch all cart items
const fetchCartItems = async (): Promise<CartResponseList[]> => {
  const response = await axiosClient.get('/v1/cart-item');
  return response.data;
};

export const useCartItemsQuery = () => {
  return useQuery('cartItems', fetchCartItems, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

// Create a cart item
const createCartItem = async (data: CreateCartItemData): Promise<ICartItem> => {
  const response = await axiosClient.post('/v1/cart-item/create', data);
  return response.data;
};

export const useCreateCartItemMutation = () => {
  return useMutation({
    mutationFn: createCartItem,
    onSuccess: () => {
      console.log('Cart item created successfully.');
    },
    onError: () => {
      console.error('Error creating cart item.');
    },
  });
};

// Update a cart item
const updateCartItem = async (data: UpdateCartItemData): Promise<ICartItem> => {
  const response = await axiosClient.put('/v1/cart-item/update', data);
  return response.data;
};

export const useUpdateCartItemMutation = () => {
  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      console.log('Cart item updated successfully.');
    },
    onError: () => {
      console.error('Error updating cart item.');
    },
  });
};

// Delete a cart item
const deleteCartItem = async (data: DeleteCartItemData): Promise<void> => {
  await axiosClient.delete('/v1/cart-item/delete', { data });
};

export const useDeleteCartItemMutation = () => {
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      console.log('Cart item deleted successfully.');
    },
    onError: () => {
      console.error('Error deleting cart item.');
    },
  });
};
