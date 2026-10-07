import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchMockUsers = async (filter: string): Promise<Payee[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  const response = await agent.get<Payee[], any, {}>('/payee/search', {
    params: {
      filter: filter.trim(),
    },
  });

  return response.data;
};

export const usePayeeSearch = (searchText: string) => {
  const { data, isFetching, isSuccess } = useQuery<Payee[]>({
    queryKey: ['payee_search' + searchText],
    queryFn: () => fetchMockUsers(searchText),
    enabled:
      searchText != null && searchText != undefined && searchText.length >= 3,
  });

  return { data, isFetching, isSuccess };
};
