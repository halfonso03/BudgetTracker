import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useGetVendorsByAccount = (accountId: number | null) => {

  const { data, isLoading } = useQuery<Vendor[]>({
    queryFn: async (): Promise<Vendor[]> => {
      const response = await agent.get<Vendor[]>(
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

const useGetAllVendors = () => {


  const { data, isLoading } = useQuery<Vendor[]>({
    queryFn: async (): Promise<Vendor[]> => {
      const response = await agent.get<Vendor[]>(`/vendor`);
      const report = response.data;
      return report;
    },
    queryKey: ['vendors'],
  });

  return { data, isLoading };
};

export { useGetAllVendors, useGetVendorsByAccount };
