import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchBalances = async (
  initiativeId?: number,
  grantId?: number,
  categoryId?: number,
): Promise<ReproAccountBalance[]> => {
  const response = await agent.get<ReproAccountBalance[]>(`/budget/balances`, {
    params: {
      initiativeId: initiativeId,
      grantId: grantId,
      categoryId: categoryId,
    },
  });
  return response.data;
};

const useCurrentAccountBalances = (
  initiativeId?: number,
  grantId?: number,
  categoryId?: number,
) => {
  const { data, isLoading, status, isFetching } = useQuery<
    ReproAccountBalance[]
  >({
    queryKey: ['repro_account_balances', initiativeId, grantId, categoryId],
    queryFn: () => fetchBalances(initiativeId, grantId, categoryId),
    enabled:
      initiativeId != undefined &&
      initiativeId != 0 &&
      grantId != undefined &&
      grantId != 0 &&
      categoryId != undefined &&
      categoryId != 0,
  });

  return { data, isLoading, status, isFetching };
};

export default useCurrentAccountBalances;
