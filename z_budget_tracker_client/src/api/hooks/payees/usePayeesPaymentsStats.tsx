import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

export const usePayeesPaymentsStats = (payeeId: number) => {
  //searchTerm

  const { data, isLoading: loadingPayees } = useQuery<PayeePaymentStats>({
    queryKey: ['payment_stats', payeeId],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const response = await agent.get(
        `/payee/payment_stats?payeeid=${payeeId}`,
        {},
      );
      return response.data;
    },
  });

  return { paymentStats: data, loadingPaymentStats: loadingPayees };
};
