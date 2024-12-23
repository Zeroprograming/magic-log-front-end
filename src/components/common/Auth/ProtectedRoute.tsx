import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { SkeletonView } from '@/components/SkeletonView';

import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void router.push('/auth/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <SkeletonView />; // Mostrar mientras se verifica la autenticación
  }

  if (!isAuthenticated) {
    return null; // O puedes redirigir de inmediato, pero el uso de 'null' evita el render
  }

  return <>{children}</>;
};

export default ProtectedRoute;
