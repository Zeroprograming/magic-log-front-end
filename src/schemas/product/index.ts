import { FiltroBase, MetaDataResponse } from '@/utils/constants';

interface ProductFilters extends FiltroBase {
  name?: string; // Nombre del producto
  sku?: string; // SKU del producto
  quantity?: number; // Cantidad disponible
  priceMin?: number; // Precio mínimo
  priceMax?: number; // Precio máximo
  userIds?: number[]; // ID del usuario que creó el producto
  createdAtFrom?: Date; // Fecha de creación (desde)
  createdAtTo?: Date; // Fecha de creación (hasta)
}

interface ProductResponse {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string; // Fecha en formato ISO
  user: {
    id: number;
    email: string;
  };
}

interface ListaProductosResponse {
  products: ProductResponse[];
  metadata: MetaDataResponse;
}

interface CreateProductDto {
  /** The name of the product */
  name: string;

  /** The SKU of the product */
  sku: string;

  /** The quantity of the product */
  quantity: number;

  /** The price of the product */
  price: number;
}

interface UpdateProductDto {
  /** ID of the product */
  id: number;

  /** The name of the product */
  name?: string;

  /** The quantity of the product */
  quantity?: number;

  /** The price of the product */
  price?: number;
}

interface ProductDto {
  /** ID of the product */
  id: number;

  /** The name of the product */
  name: string;
}

interface ProductUserResponse {
  /** ID of the user */
  id: number;

  /** Name of the user */
  email: string;
}

interface ProductResponse {
  /** ID of the product */
  id: number;

  /** The name of the product */
  name: string;

  /** The SKU of the product */
  sku: string;

  /** The quantity of the product */
  quantity: number;

  /** The price of the product */
  price: number;

  /** The creation date of the product */
  createdAt: string;

  /** The user who created the product */
  user: ProductUserResponse;
}

interface ListaProductosResponse {
  /** List of products */
  products: ProductResponse[];

  /** Metadata */
  metadata: MetaDataResponse;
}

export type {
  CreateProductDto,
  ListaProductosResponse,
  MetaDataResponse,
  ProductDto,
  ProductFilters,
  ProductResponse,
  ProductUserResponse,
  UpdateProductDto,
};
