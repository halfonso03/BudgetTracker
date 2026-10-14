import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useReportParameterData = (
  report_id: number,
  parameter_id: number,
  showAllOption: boolean,
) => {
  const { data, isLoading } = useQuery<ReportParameterValue[]>({
    queryFn: async (): Promise<ReportParameterValue[]> => {
      const response = await agent.get<ReportParameterValue[]>(
        `/report/parameters/data/${report_id}/${parameter_id}?showAllOptions=${showAllOption}`,
      );
      const report = response.data;
      return report;
    },
    queryKey: ['report', 'parameters', parameter_id],
  });

  return { data, isLoading };
};

export default useReportParameterData;
