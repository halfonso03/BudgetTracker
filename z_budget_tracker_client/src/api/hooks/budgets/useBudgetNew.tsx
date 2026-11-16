import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchBudget = async (
  initiative_id: number,
  grant_id: number,
): Promise<NewBudget[]> => {
  const response = await agent.get<NewBudget[]>('/Budget/NewBudget', {
    params: {
      grantId: grant_id,
      initiativeId: initiative_id,
    },
  });

  // budget = {
  //   ...budget,
  //   account_balances: budget.account_balances.map((b) => ({ ...b })),
  // };
  return response.data;
};

const useBudgetNew = (initiative_id: number, grant_id: number) => {
  const { data, isLoading, isSuccess } = useQuery<NewBudget[]>({
    queryFn: () => fetchBudget(initiative_id, grant_id),
    queryKey: ['budget_new', initiative_id, grant_id],
    enabled: initiative_id !== 0 && grant_id !== 0,
  });

  return { data, isLoading, isSuccess };
};

export default useBudgetNew;

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
