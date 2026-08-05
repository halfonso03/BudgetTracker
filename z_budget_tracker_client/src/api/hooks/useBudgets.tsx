import { useQuery } from '@tanstack/react-query';
import agent from '../agent';

const fetchBudget = async (
  initiative_id: number,
  grant_id: number,
): Promise<Budget> => {
  const response = await agent.get<Budget>('/Budget/GetBudget', {
    params: {
      grantId: grant_id,
      initiativeId: initiative_id,
    },
  });

  const budget = response.data;

  // budget = {
  //   ...budget,
  //   account_balances: budget.account_balances.map((b) => ({ ...b })),
  // };

  return budget;
};

const useBudgetDetails = (initiative_id: number, grant_id: number) => {
  const { data, isLoading } = useQuery<Budget>({
    queryFn: () => fetchBudget(initiative_id, grant_id),
    queryKey: ['budgets', initiative_id, grant_id],
  });

  return { data, isLoading };
};

export default useBudgetDetails;

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
