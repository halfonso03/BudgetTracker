import { useQuery } from '@tanstack/react-query';
import agent from '../agent';

const fetchBudgetSummary = async (year: number): Promise<Budget[]> => {
  const response = await agent.get<Budget[]>('/Budget/GetBudgetsForYear', {
    params: {
      year: year,
    },
  });

  const budgets = response.data;

  return budgets;

};

const useBudgetSummary = (year: number) => {
  const { data, isLoading } = useQuery<Budget[]>({
    queryFn: () => fetchBudgetSummary(year),
    queryKey: ['budgets', year],
  });

  return { data, isLoading };
};

export default useBudgetSummary;




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