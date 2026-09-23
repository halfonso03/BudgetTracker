import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import agent from '../../api/agent';
import Select from '../../components/Select';
import CheckBoxList from '../../components/CheckBoxList';
import { useState, type ChangeEvent } from 'react';

type Props = {
  reportId: number;
  parameters: ReportParameter2[];
};

type ParameterQueryResult = {} & UseQueryResult<
  {
    parameterName: string;
    controlType: string;
    dependsOn: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  },
  Error
>;

type ParameterDependency = {
  parameterName: string;
  dependentParameterName: string;
  value: string;
};

async function fetchSelectionOptions(
  reportId: number,
  reportParameter: ReportParameter2,
  dependentvalues: ParameterDependency[] | null,
): Promise<{ id: number }[]> {
  let url = `/reports/parameters/values/${reportId}/${reportParameter.id}?showAllOption=false`;

  if (
    dependentvalues?.some(
      (x) => x.dependentParameterName === reportParameter.name,
    )
  ) {
    const dependsOnValue = dependentvalues.filter(
      (x) => x.dependentParameterName === reportParameter.name,
    )[0].value;

    url += '&selectedValue=' + dependsOnValue;
  }

  const response = await agent.get(url);
  return response.data;
}

const ReportParameters = ({ reportId, parameters }: Props) => {
  const [parentValues, setParentValues] = useState<
    ParameterDependency[] | null
  >(null);

  const userQueries = useQueries({
    queries: parameters.map((parameter) => {
      let parentValue2 = null;
      if (
        parentValues?.some((x) => x.dependentParameterName === parameter.name)
      ) {
        parentValue2 = parentValues.filter(
          (x) => x.dependentParameterName === parameter.name,
        )[0].value;
      }

      return {
        queryKey: ['report', 'parameters', parentValue2, parameter.id],
        queryFn: () => fetchSelectionOptions(reportId, parameter, parentValues),
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

  function getControl(
    parameterName: string,
    controlType: string,
    results: ParameterQueryResult[],
  ) {
    if (controlType === 'dropdownlist') {
      return getDropdownList(results, parameterName);
    } else if (controlType === 'checkboxlist') {
      return getCheckboxList(results, parameterName);
    }
  }

  function getCheckboxList(
    results: ParameterQueryResult[],
    parameterName: string,
  ) {
    if (results.some((x) => x.data?.parameterName == parameterName)) {
      const data = results.filter(
        (x) => x.data?.parameterName == parameterName,
      )[0].data;
      if (data) {
        const items: { id: number; name: string; checked: boolean }[] =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.data.map((d: any) => ({
            id: d.id,
            name: d.text,
            checked: true,
          }));
        return (
          <div className="border border-neutral-300 rounded-sm">
            <CheckBoxList
              label=""
              key={crypto.randomUUID()}
              items={items}
              maxHeight={199}
            ></CheckBoxList>
          </div>
        );
      }
    }
  }

  function getDropdownList(
    results: ParameterQueryResult[],
    parameterName: string,
  ) {
    if (results.some((x) => x.data?.parameterName == parameterName)) {
      const data = results.filter(
        (x) => x.data?.parameterName == parameterName,
      )[0].data;

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = data.data.map((d: any, i: number) => (
          <option key={i} value={d.id}>
            {d.text}
          </option>
        ));

        if (parameters.some((x) => x.dependsOn === parameterName)) {
          const onClick = (e: ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            const depParam = parameters.filter(
              (x) => x.dependsOn === parameterName,
            )[0];
            if (
              parentValues?.some(
                (x) =>
                  x.parameterName === parameterName &&
                  x.dependentParameterName == depParam.name &&
                  x.value === value,
              )
            )
              return;

            setParentValues((prev) => {
              const old = prev ?? [];
              if (
                old.some(
                  (x) =>
                    x.parameterName === parameterName &&
                    x.dependentParameterName == depParam.name &&
                    x.value !== value,
                )
              ) {
                old.filter(
                  (x) =>
                    x.parameterName === parameterName &&
                    x.dependentParameterName == depParam.name,
                )[0].value = value;
                return { ...old, value: value };
              }

              return [
                {
                  parameterName: parameterName,
                  dependentParameterName: depParam.name,
                  value: e.target.value,
                },
              ];
            });
          };
          return <Select onChange={onClick}>{options}</Select>;
        } else {
          return <Select>{options}</Select>;
        }
      }
    }

    return null;
  }

  return (
    <div>
      {/* <pre>{JSON.stringify(parentValues)}</pre> */}
      {parameters.map((p, index) => {
        return (
          <div
            key={index}
            className="grid gap-2 grid-cols-[.3fr_1fr] mb-3 items-center"
          >
            <div className="self-start">{p.label}</div>
            <div>{getControl(p.name, p.controlType, userQueries)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportParameters;
