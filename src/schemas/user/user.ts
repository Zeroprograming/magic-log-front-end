// Definir los tipos para los filtros y la respuesta

import { MetaDataResponse } from '@/utils/constants';

export interface UserProfileFilters {
  name?: string;
  email?: string;
  role?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RoleDto {
  id: number;
  name: string;
}

export interface CartDto {
  id: number;
  total: number;
}

export interface UserProfileDto {
  id: number;
  email: string;
  role: RoleDto;
  cart?: CartDto;
}

export interface ListaUsuariosResponse {
  users: UserProfileDto[];
  meta: MetaDataResponse;
}
