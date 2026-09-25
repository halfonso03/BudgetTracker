import { useQueries } from '@tanstack/react-query';
import agent from '../../agent';

async function fetchParamOptions(
  reportId: number,
  reportParameter: ReportParameter2,
  dependentvalue: string | null,
): Promise<{ id: number }[]> {
  let url = `/reports/parameters/values/${reportId}/${reportParameter.id}?showAllOption=false`;

  if (dependentvalue) {
    url += '&selectedValue=' + dependentvalue;
  }

  const response = await agent.get(url);
  return response.data;
}

const useParamOptionsQueries = (
  reportId: number,
  parameters: ReportParameter2[],
  paramDep: ParameterDependency[],
) => {
  const paramOptionsQueries = useQueries({
    queries: parameters.map((parameter) => {
      let parentValue1 = null;
      if (paramDep?.some((x) => x.dependentParameterName === parameter.name)) {
        parentValue1 = paramDep.filter(
          (x) => x.dependentParameterName === parameter.name,
        )[0].value;
      }
      return {
        queryKey: ['report', 'parameters', parentValue1, parameter.id],
        queryFn: () => fetchParamOptions(reportId, parameter, parentValue1),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        select: (data: any) => {
          return {
            parameterName: parameter.name,
            controlType: parameter.controlType,
            dependsOn: parameter.dependsOn,
            data,
          };
        },
      };
    }),
  });

  return { paramOptionsQueries };
};

export default useParamOptionsQueries;
