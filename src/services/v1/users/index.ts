import { useQuery } from 'react-query';

import { axiosClient } from '@/api/axios_client';
import { ListaUsuariosResponse, UserProfileFilters } from '@/schemas/user/user';

const fetchUsers = async (
  filters: UserProfileFilters,
): Promise<ListaUsuariosResponse> => {
  const response = await axiosClient.get<ListaUsuariosResponse>(
    'v1/users/list',
    {
      params: filters,
    },
  );
  return response.data;
};

export const useUsersQuery = (filters: UserProfileFilters = {}) => {
  return useQuery(['users', filters], async () => await fetchUsers(filters), {
    staleTime: 60000, // 1 minuto
    keepPreviousData: true, // Mantener los datos previos mientras se cargan los nuevos
  });
};
