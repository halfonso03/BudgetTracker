import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useReports = () => {
  const { data, isLoading } = useQuery<Report2[]>({
    queryFn: async (): Promise<Report2[]> => {
      const response = await agent.get<Report2[]>(`/reports/list`);
      const report = response.data;
      return report;
    },
    queryKey: ['reports'],
  });

  return { data, isLoading };
};
export default useReports;
