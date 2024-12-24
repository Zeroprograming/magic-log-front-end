import { useMutation, useQuery } from 'react-query';

import { axiosClient } from '@/api/axios_client';
import {
  CreateProductDto,
  ListaProductosResponse,
  ProductFilters,
  ProductResponse,
  UpdateProductDto,
} from '@/schemas/product';

// Validar SKU
const validateSku = async (sku: string) => {
  const response = await axiosClient.get(`v1/products/sku-validation`, {
    params: { sku },
  });
  return response.data;
};

export const useValidateSkuQuery = (sku: string) => {
  return useQuery(['validateSku', sku], async () => await validateSku(sku), {
    enabled: !!sku, // Solo ejecuta si se pasa un SKU
  });
};

const fetchProducts = async (filters: ProductFilters) => {
  const response = await axiosClient.get<ListaProductosResponse>(
    `v1/products`,
    { params: filters },
  );
  return response.data;
};

export const useProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery(
    ['products', filters],
    async () => await fetchProducts(filters),
    {
      staleTime: 60000, // 1 minuto
    },
  );
};

// Crear producto
const createProduct = async (product: CreateProductDto) => {
  const response = await axiosClient.post(`v1/products/create`, product);
  return response.data;
};

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      console.log('Producto creado exitosamente');
    },
    onError: (error) => {
      console.error('Error al crear producto:', error);
    },
  });
};

// Actualizar producto
const updateProduct = async (product: UpdateProductDto) => {
  const response = await axiosClient.put(`v1/products/update`, product);
  return response.data;
};

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      console.log('Producto actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error al actualizar producto:', error);
    },
  });
};

// Eliminar producto
const deleteProduct = async (id: number) => {
  const response = await axiosClient.delete(`v1/products/delete`, {
    params: { id },
  });
  return response.data;
};

export const useDeleteProductMutation = () => {
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      console.log('Producto eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error al eliminar producto:', error);
    },
  });
};

const getProductById = async (id: string) => {
  const response = await axiosClient.get<ProductResponse>(`v1/products/get`, {
    params: { id },
  });
  return response.data;
};

export const useProductByIdQuery = (id: string) => {
  return useQuery(['productById', id], async () => await getProductById(id), {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
