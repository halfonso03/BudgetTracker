import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchRepro = async (
): Promise<BudgetSurplusBurnRate[]> => {
    const response = await agent.get<BudgetSurplusBurnRate[]>(
        `/dashboard/budgetSurplusBurnRateReport`,
    );
    return response.data ?? ([] as string[]);
};

const useBudgetSurplusBurnRate = () => {
    const {
        data,
        isSuccess,
        isLoading,
        status,
        isFetching,
        isPending,
        isFetched,
    } = useQuery<BudgetSurplusBurnRate[]>({
        queryKey: ['budgetSurplusBurnRate'],
        queryFn: () => fetchRepro(),

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
