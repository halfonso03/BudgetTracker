import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchRepro = async (initiativeId: number, grantId: number
): Promise<BudgetSurplusBurnRateByAccount[]> => {
    const response = await agent.get<BudgetSurplusBurnRateByAccount[]>(
        `/dashboard/BudgetSurplusBurnRateByAccountReport?initiativeId=${initiativeId}&grantId=${grantId}`,
    );
    return response.data ?? ([] as string[]);
};

const useBudgetSurplusBurnRate = (initiativeId: number, grantId: number) => {
    const {
        data,
        isSuccess,
        isLoading,
        status,
        isFetching,
        isPending,
        isFetched,
    } = useQuery<BudgetSurplusBurnRateByAccount[]>({
        queryKey: ['budgetSurplusBurnRateByAccount', initiativeId, grantId],
        queryFn: () => fetchRepro(initiativeId, grantId),
        enabled: initiativeId !== 0 && initiativeId !== undefined
    });

    return {
        data,
        isSuccess,
        isLoading,
        status,
        isFetching,
        isPending,
        isFetched,
    };
};

export default useBudgetSurplusBurnRate;
