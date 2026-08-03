import { useQuery } from '@tanstack/react-query';
// import budgets from '../../sample_data/budgets';
import agent from '../agent';

const fetchBudgetSummary = async (year: number): Promise<Budget[]> => {
  const response = await agent.get<Budget[]>('/Budget/GetBudgetSummary', {
    params: {
      year: year,
    },
  });

  const budgets = response.data;

  return budgets;

  // return response.data
  // const b: BudgetSummary[] = budgets
  //   .filter((x) => x.year == year)
  //   .map((b) => {
  //     return {
  //       initiative_id: b.initiative_id,
  //       initiative_name: b.initiative!.name,
  //       grant_id: b.grant_id,
  //       grant_name: b.grant!.name,
  //       year: b.year,
  //       amount: b.items.map((i) => i.amount).reduce((acc, cur) => acc + cur, 0),
  //     };
  //   });

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(b);
  //   }, 300); // Simulates 1.5 seconds of network delay
  // });
};

const useBudgetSummary = (year: number) => {
  const { data, isLoading } = useQuery<Budget[]>({
    queryFn: () => fetchBudgetSummary(year),
    queryKey: ['budget_summary', year],
  });

  return { data, isLoading };
};

export default useBudgetSummary;
