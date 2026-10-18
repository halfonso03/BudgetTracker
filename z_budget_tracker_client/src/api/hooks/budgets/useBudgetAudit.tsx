import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchBudget = async (
  initiative_id: number,
  grant_id: number,
): Promise<BudgetAudit[]> => {
  const response = await agent.get<BudgetAudit[]>('/budget/budgetAudit', {
    params: {
      grantId: grant_id,
      initiativeId: initiative_id,
    },
  });

  return response.data;
};

const useBudgetAudit = (initiative_id: number, grant_id: number) => {

  console.log(initiative_id, grant_id)
  const { data, isLoading } = useQuery<BudgetAudit[]>({
    queryFn: () => fetchBudget(initiative_id, grant_id),
    queryKey: ['budget_audit', initiative_id, grant_id],
  });

  return { data, isLoading };
};

export default useBudgetAudit;

