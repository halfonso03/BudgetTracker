import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useReportParameterData = (
  report_id: number,
  parameter_id: number,
  showAllOption: boolean,
) => {
  const { data, isLoading } = useQuery<ReportParamterValue[]>({
    queryFn: async (): Promise<ReportParamterValue[]> => {
      const response = await agent.get<ReportParamterValue[]>(
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
