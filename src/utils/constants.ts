interface MetaDataResponse {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface FiltroBase {
  sort?: string; // Campo para ordenar
  order?: 'asc' | 'desc'; // Orden de clasificación
  page?: number; // Número de página para paginación
  limit?: number; // Número de elementos por página
}

export type { FiltroBase, MetaDataResponse };
