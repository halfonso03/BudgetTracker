import { useQuery, useQueryClient } from '@tanstack/react-query';
import agent from '../../agent';

const fetchAccounts = async (
  categoryId: number | undefined,
): Promise<Account[]> => {
  const response = await agent.get<Account[]>(`/Category/${categoryId}`);
  return response.data;
};

const useAccounts = (categoryId: number | undefined) => {
  const queryClient = useQueryClient();

  const { data, isLoading, status, isFetching } = useQuery<Account[]>({
    queryKey: ['accounts', categoryId],
    queryFn: () => fetchAccounts(+categoryId!),
    enabled: !queryClient.getQueryData(['accounts', categoryId]),
  });

  return { data, isLoading, status, isFetching };
};

export default useAccounts;
