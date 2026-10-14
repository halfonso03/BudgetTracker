import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchRepro = async (id: number): Promise<Payment> => {
  const response = await agent.get<Payment>(`/payment/${id}`);
  return response.data as Payment;
};

const useGetPayment = (id: number | undefined) => {
  const {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  } = useQuery<Payment>({
    queryKey: ['payment', id],
    queryFn: () => fetchRepro(id ?? 0),
    staleTime: 1 * 1000 * 60,
    enabled: !!id,
  });

  return {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  };
};

export default useGetPayment;
