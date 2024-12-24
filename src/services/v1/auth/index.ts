import { useMutation, useQuery } from 'react-query';

import { axiosClient } from '@/api/axios_client';
import {
  IUserProfile,
  LoginFormData,
  RegisterFormData,
} from '@/schemas/auth/auth';

const register = async (
  formData: RegisterFormData,
): Promise<{ access_token: string }> => {
  const response = await axiosClient.post('v1/auth/register', {
    email: formData.email,
    password: formData.password,
  });

  return response.data; // El token de acceso
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {},
    onError: () => {},
  });
};

const login = async (
  formData: LoginFormData,
): Promise<{ access_token: string }> => {
  const response = await axiosClient.post('v1/auth/login', {
    email: formData.email,
    password: formData.password,
  });

  return response.data; // El token de acceso
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login, // Correcto en v4
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
    },
    onError: () => {},
  });
};

const logout = async (): Promise<void> => {
  const response = await axiosClient.post('v1/auth/logout');
  return response.data;
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {},
    onError: () => {},
  });
};

export const fetchUsuarioActual = async () => {
  const response = await axiosClient.get<IUserProfile>('v1/auth/profile');
  return response.data;
};

export const useUsuarioActualQuery = () => {
  return useQuery('usuarioActual', fetchUsuarioActual, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: false, // Deshabilitar la ejecución automática
  });
};
