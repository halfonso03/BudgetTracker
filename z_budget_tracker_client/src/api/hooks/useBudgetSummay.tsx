import { useQuery } from '@tanstack/react-query';
import budgets from '../../sample_data/budgets';
import initiatives from '../../sample_data/initiatives';
import grants from '../../sample_data/grants';

const fetchBudgetSummary = async (): Promise<BudgetSummary[]> => {
  console.log('budgets', budgets);

  const b: BudgetSummary[] = budgets.map((b) => {
    return {
      initiative_id: b.initiative_id,
      initiative_name: initiatives.filter((i) => i.id == b.initiative_id)[0]
        .name,
      grant_id: b.grant_id,
      grant_name: grants.filter((i) => i.id == b.grant_id)[0].name,
      year: b.year,
      amount: b.items.map((i) => i.amount).reduce((acc, cur) => acc + cur, 0),
    };
  });

  console.log('b', b);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(b);
    }, 300); // Simulates 1.5 seconds of network delay
  });
};

const useBudgetSummary = () => {
  const { data, isLoading } = useQuery<BudgetSummary[]>({
    queryFn: fetchBudgetSummary,
    queryKey: ['budget_summary'],
  });

  return { data, isLoading };
};

export default useBudgetSummary;
