import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchPayee = async (payeeId: number): Promise<Payee> => {
  const response = await agent.get<Payee>(`/payee?payeeId=${payeeId}`);
  return response.data;
};

const useSelectedPayeeInfo = (payeeId: number | undefined | null) => {
  const { data, isLoading, status, isFetching, isSuccess } = useQuery<Payee>({
    queryFn: () => fetchPayee(payeeId ?? 0),
    queryKey: ['payee', payeeId],
    enabled: payeeId !== null && payeeId !== undefined,    
  });

  return { data, isLoading, status, isFetching, isSuccess };
};

export default useSelectedPayeeInfo;
