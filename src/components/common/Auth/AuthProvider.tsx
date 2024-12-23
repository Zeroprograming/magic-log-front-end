import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { axiosClient, setupAxiosInterceptors } from '@/api/axios_client';
import { chargeUser, updateUser } from '@/store';
import { getCurrentUser } from '@/store/selectors/user';
import { User } from '@/utils/constants';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean; // Nuevo estado
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(getCurrentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Nuevo estado

  useEffect(() => {
    // Obtener el token de localStorage o cookies
    const token =
      localStorage.getItem('accessToken') ?? getCookie('accessToken');

    // Verificar si la ruta actual es '/auth/sign-in' o si no hay token
    if (!token || router.pathname === '/auth/sign-in') {
      // Si no hay token o estás en la página de sign-in, termina la carga y evita la petición
      setIsLoading(false);
      return; // Salir del useEffect
    }

    // Solo hacer la petición si hay un token y NO estás en '/auth/sign-in'
    axiosClient
      .get('/actual')
      .then((response) => {
        dispatch(chargeUser({ user: response.data }));
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Si la petición falla, eliminar el token y marcar como no autenticado
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
      })
      .finally(() => {
        // Asegurar que el estado de carga se establezca a false
        setIsLoading(false);
      });
  }, [router.pathname]); // Dependencia en router.pathname para que se ejecute al cambiar de ruta

  const login = (userData: User) => {
    dispatch(
      chargeUser({
        user: userData,
      }),
    );
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    dispatch(
      updateUser({
        user: {},
      }),
    );
    setIsAuthenticated(false);
    void router.push('/auth/sign-in');
  };

  useEffect(() => {
    setupAxiosInterceptors(logout); // Pasar la función de logout a Axios
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
