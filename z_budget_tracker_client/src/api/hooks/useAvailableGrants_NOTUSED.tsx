import { useQuery } from '@tanstack/react-query';
import grants from '../../sample_data/grants';
import budgets from '../../sample_data/budgets';

const fetchAvailableGrant = async (initiativeId: number): Promise<Grant[]> => {
  const initiativeBudgets = budgets.filter(
    (x) => x.initiative_id === initiativeId,
  );
  const g = grants;

  if (initiativeBudgets.length === 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(g);
      }, 300);
    });
  } else {
    
    // const t = initiativeBudgets.map((b) => ({
    //   id: b.grant_id,
    //   has: grants.map((g) => g.id).some(() => b.grant_id),
    // }));


    // const usedGrants = g.some((value) =>
    //   initiativeBudgets.map((b2) => b2.grant_id).includes(value.id),
    // );

    // grants.filter(g => usedGrants.indexOf(g.id) === -1);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(g);
      }, 300);
    });
  }
};

const useAvailableGrants = (initiativeId: number) => {
  const { data, isLoading } = useQuery<Grant[]>({
    queryKey: ['grants_avaliable', initiativeId],
    queryFn: () => fetchAvailableGrant(initiativeId),
    enabled: initiativeId !== 0,
  });

  return { data, isLoading };
};

export default useAvailableGrants;
