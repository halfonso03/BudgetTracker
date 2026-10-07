import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchBalances = async (
  initiativeId?: number,
  grantId?: number,
  categoryId?: number,
): Promise<PaymentAvailableAccountBalance[]> => {
  const response = await agent.get<PaymentAvailableAccountBalance[]>(`/payment/balances`, {
    params: {
      initiativeId: initiativeId,
      grantId: grantId,
      categoryId: categoryId,
    },
  });
  return response.data;
};

const useAvailableAccountBalances = (
  initiativeId?: number,
  grantId?: number,
  categoryId?: number,
) => {
  const { data, isLoading, status, isFetching, isSuccess } = useQuery<
    PaymentAvailableAccountBalance[]
  >({
    queryFn: () => fetchBalances(initiativeId, grantId, categoryId),
    queryKey: ['payment_account_balances', initiativeId, grantId, categoryId],
    enabled:
      initiativeId != undefined &&
      initiativeId != 0 &&
      grantId != undefined &&
      grantId != 0 &&
      categoryId != undefined &&
      categoryId != 0,
  });

  return { data, isLoading, status, isFetching, isSuccess };
};

export default useAvailableAccountBalances;
