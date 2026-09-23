import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useReport = (report_id: number) => {
  const { data, isLoading } = useQuery<Report>({
    queryFn: async (): Promise<Report> => {
      const response = await agent.get<Report>(`/report/${report_id}`);
      const report = response.data;
      return report;
    },
    queryKey: ['report', report_id],
  });

  return { data, isLoading };
};

export default useReport;
