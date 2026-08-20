import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchInitiatives = async (categoryId: number | undefined): Promise<Account[]> => {
  const response = await agent.get<Account[]>(`/Category/${categoryId}`);
  return response.data;
};

const useAccounts = (categoryId: number | undefined) => {
  const { data, isLoading, status, isFetching } = useQuery<Account[]>({
    queryKey: ['accounts', categoryId],
    queryFn: () => fetchInitiatives(+categoryId!),
    enabled: categoryId != undefined && categoryId != 0,
  });

  return { data, isLoading, status, isFetching };
};

export default useAccounts;
