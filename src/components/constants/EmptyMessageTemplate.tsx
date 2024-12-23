/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import React from 'react';

import { Button } from '@/components/ui/button';

interface EmptyMessageTemplateProps {
  title: string;
  message: string;
  refetch: () => void;
  onGlobalFilterChange: (e: any) => void;
  setFilters?: (filters: any) => void;
  initialFilters?: { [key: string]: any }; // Permite un esquema de filtros flexible
}

const EmptyMessageTemplate: React.FC<EmptyMessageTemplateProps> = ({
  title,
  message,
  refetch,
  onGlobalFilterChange,
  setFilters,
  initialFilters,
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-96 space-y-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-600">{title}</h1>
      <p className="text-lg text-gray-500">{message}</p>
      <Button
        onClick={() => {
          refetch();

          onGlobalFilterChange({
            target: { value: '' },
          });

          // Usar el esquema de filtros pasado como prop
          setFilters && setFilters(initialFilters ?? {}); // Restablecer a un objeto vacío si no se proporciona
        }}
        className="px-6 py-3 bg-primaryVariant-surface-default text-white rounded-lg shadow hover:bg-primaryVariant-surface-darker transition-transform transform hover:scale-105 active:scale-95"
      >
        Recargar
      </Button>
    </div>
  );
};

export default EmptyMessageTemplate;
