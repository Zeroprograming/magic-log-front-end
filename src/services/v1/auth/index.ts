import { useMutation, useQuery } from 'react-query';

import { axiosClient } from '@/api/axios_client';

interface LoginFormData {
  email: string;
  password: string;
}

const login = async (
  formData: LoginFormData,
): Promise<{ access_token: string }> => {
  const response = await axiosClient.post('login', {
    email: formData.email,
    password: formData.password,
  });

  return response.data; // El token de acceso
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login, // Correcto en v4
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.access_token);
    },
    onError: () => {},
  });
};

const logout = async (): Promise<void> => {
  const response = await axiosClient.post('v1/auth/logoff');
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
  const response = await axiosClient.get('actual');
  return response.data;
};

export const useUsuarioActualQuery = () => {
  return useQuery('usuarioActual', fetchUsuarioActual, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: false, // Deshabilitar la ejecución automática
  });
};

const getNextRadicadoNumber = async (): Promise<string> => {
  const response = await axiosClient.get('radicado/next');
  return response.data.nextRadicado;
};

export const useNextRadicadoNumberQuery = () => {
  return useQuery('nextRadicadoNumber', getNextRadicadoNumber, {
    refetchOnWindowFocus: false,
  });
};

const createRadicado = async (data: {
  titulo: string;
  responsable: string;
}) => {
  const response = await axiosClient.post('radicado/crear', data);
  return response.data;
};

export const useCreateRadicadoMutation = () => {
  return useMutation({
    mutationFn: createRadicado,
    onSuccess: () => {},
    onError: () => {},
  });
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const revertRadicado = async (numero_radicado: string) => {
  const response = await axiosClient.delete(
    `radicado/revertir/${numero_radicado}`,
  );
  return response.data;
};

export const useRevertRadicadoMutation = () => {
  return useMutation({
    mutationFn: revertRadicado,
    onSuccess: (data) => {
      // Opcional: Maneja el éxito, por ejemplo, mostrando un mensaje
      console.log('Radicado reverted successfully:', data);
    },
    onError: (error: any) => {
      // Opcional: Maneja el error, por ejemplo, mostrando un mensaje de alerta
      console.error(
        'Error reverting radicado:',
        error?.response?.data?.message || error.message,
      );
    },
  });
};
