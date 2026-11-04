import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchRepro = async (year: number): Promise<PaymentSearchBudgetHeaderResponse[]> => {
  const response = await agent.get<PaymentSearchBudgetHeaderResponse[]>(`/search/budgets?year=${year}`);
  return response.data;
};

const usePaymentSearchBudgetHeaders = (year:number) => {
  const {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  } = useQuery<PaymentSearchBudgetHeaderResponse[]>({
    queryKey: ['payment_search_budget_header', year],
    queryFn: () => fetchRepro(year ?? 0),
    staleTime: 1 * 1000 * 60,
    enabled: !!year,
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

export default usePaymentSearchBudgetHeaders;
