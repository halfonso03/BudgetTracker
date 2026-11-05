import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

export const usePayeesAll = () => {
  const { data, isLoading: loadingPayees } = useQuery<Payee[]>({
    queryKey: ['payees_all'],
    staleTime: 1 * 60 * 1000 * 60,
    queryFn: async () => {
      const response = await agent.get(`/payee/all`, {});
      return response.data;
    },
  });

  return { data, loadingPayees: loadingPayees };
};
