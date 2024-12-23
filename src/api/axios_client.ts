// src/api/axiosClient.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getCookie } from 'cookies-next';

import { toast } from '@/components/ui/use-toast';
import settings from '@/settings/'; // Importar las configuraciones

// Configurar la instancia de Axios usando settings
const axiosClient = axios.create({
  baseURL: settings.API_URL, // Utilizar la URL base desde settings
  withCredentials: true,
});

// Interceptor para agregar el JWT a cada solicitud
axiosClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<any>,
  ): InternalAxiosRequestConfig<any> => {
    const token =
      localStorage.getItem('accessToken') ?? getCookie('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    return await Promise.reject(error);
  },
);

// Interceptor para manejar respuestas y errores
const setupAxiosInterceptors = (logout: () => void) => {
  axiosClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    async (error: AxiosError): Promise<AxiosError> => {
      if (error.response?.status === 403) {
        toast({
          title: 'Error de autenticación',
          description:
            'No tienes permiso para acceder a esta página o recurso.',
        });
        logout(); // Usar la función de logout pasada como argumento
      }
      if (error.response?.status === 401) {
        // toast({
        //   title: 'Error de autenticación',
        //   description:
        //     'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
        // });
        // logout(); // Usar la función de logout pasada como argumento
      }
      return await Promise.reject(error);
    },
  );
};

export { axiosClient, setupAxiosInterceptors };
