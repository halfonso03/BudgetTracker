import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchBalances = async (
  initiativeId?: number,
  grantId?: number,
  categoryId?: number,
): Promise<PaymentRemainingAccountBalance[]> => {
  const response = await agent.get<PaymentRemainingAccountBalance[]>(
    `/payment/balances`,
    {
      params: {
        initiativeId: initiativeId,
        grantId: grantId,
        categoryId: categoryId,
      },
    },
  );
  return response.data;
};

const useRemainingAccountBalances = (
  initiativeId?: number,
  grantId?: number,
  categoryId?: number,
  accountId?: number,
) => {
  const { data, isLoading, status, isFetching, isSuccess } = useQuery<
    PaymentRemainingAccountBalance[]
  >({
    queryFn: () => fetchBalances(initiativeId, grantId, categoryId),
    queryKey: [
      'payment_account_balances',
      initiativeId,
      grantId,
      categoryId,
      accountId,
    ],
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

export default useRemainingAccountBalances;
