import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useGetPayeesByAccount = (accountId: number | null) => {

  const { data, isLoading } = useQuery<Payee[]>({
    queryFn: async (): Promise<Payee[]> => {
      const response = await agent.get<Payee[]>(
        `/vendor/vendorsForAccount?accountId=${accountId}`,
      );
      const report = response.data;
      return report;
    },
    queryKey: ['vendors', accountId],
    enabled: accountId !== null,
  });

  return { data, isLoading };
};

const useGetAllPayees = () => {


  const { data, isLoading } = useQuery<Payee[]>({
    queryFn: async (): Promise<Payee[]> => {
      const response = await agent.get<Payee[]>(`/vendor`);
      const report = response.data;
      return report;
    },
    queryKey: ['vendors'],
  });

  return { data, isLoading };
};

export { useGetAllPayees, useGetPayeesByAccount };
