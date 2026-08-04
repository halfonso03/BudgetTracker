import { useQuery } from '@tanstack/react-query';
import agent from '../agent';

const fetchBudget = async (
  year: number,
  initiative_id: number,
): Promise<Budget> => {
  const response = await agent.get<Budget>('/Budget/GetBudget', {
    params: {
      year: year,
      initiativeId: initiative_id,
    },
  });

  const budgets = response.data;

  return budgets;
};

const useBudgetSummary = (year: number, initiative_id: number) => {
  const { data, isLoading } = useQuery<Budget>({
    queryFn: () => fetchBudget(year, initiative_id),
    queryKey: ['budgets', initiative_id, year],
  });

  return { data, isLoading };
};

export default useBudgetSummary;

// const fetchBudget = async (initiativeId: number, grantId: number): Promise<Budget> => {

//     const response = await agent.get<Role[], any, {}>("/groups", {
//         params: {
//             "filter": filter.trim()
//         },
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     // return response.data

//     const budget = budgets.filter(x => x.initiative_id == initiativeId && x.grant_id == grantId);

//     return new Promise((resolve, reject) => {

//         setTimeout(() => {
//             if (budget && budget.length === 1) {
//                 resolve(budget[0]);

//             } else {
//                 reject('Budget not found')
//             }
//         }, 50);
//     });
// };

// const useBudget = (initiatveId: number, grantId: number) => {

//     const { data, isLoading } = useQuery<Budget>({
//         queryKey: ['budget', initiatveId, grantId],
//         queryFn: () => fetchBudget(initiatveId, grantId),
//     })

//     return { data, isLoading }
// }

// export default useBudget;
