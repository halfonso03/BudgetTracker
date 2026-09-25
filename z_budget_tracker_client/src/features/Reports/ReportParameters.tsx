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

type ParameterSelections = {
  name: string;
  value?: string;
  values?: string[];
};

async function fetchOptions(
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

const ReportParameters = ({ reportId, parameters }: Props) => {
  // console.log('ReportParameters render');
  const [paramDep, setParamDep] = useState<ParameterDependency[]>([]);
  const [selectedValues, setSelectedValues] = useState<ParameterSelections[]>(
    [],
  );

  const userQueries = useQueries({
    queries: parameters.map((parameter) => {
      let parentValue1 = null;
      if (paramDep?.some((x) => x.dependentParameterName === parameter.name)) {
        parentValue1 = paramDep.filter(
          (x) => x.dependentParameterName === parameter.name,
        )[0].value;
      }

      //  this might not do anything
      // for (const s of selectedValues) {
      //   if (paramDep.some((x) => x.parameterName === s.name)) {
      //     parentValue1 = s.value;
      //   }
      // }

      return {
        queryKey: ['report', 'parameters', parentValue1, parameter.id],
        queryFn: () => fetchOptions(reportId, parameter, parentValue1),
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

  const succeededCount = userQueries.filter((q) => q.isSuccess).length;
  const initialSelectedValues: ParameterSelections[] = [];

  if (succeededCount === userQueries.length && selectedValues.length === 0) {
    for (const q of userQueries) {
      const pName = q.data?.parameterName;
      if (!selectedValues.some((s) => s.name === pName)) {
        if (q.data?.controlType === 'dropdownlist') {
          initialSelectedValues.push({
            name: pName!,
            value: q.data.data[0].id.toString(),
          });
        }
        if (q.data?.controlType === 'checkboxlist') {
          initialSelectedValues.push({
            name: pName!,
            values: [],
          });
        }
      }
    }
    setSelectedValues(initialSelectedValues);
  }

  // save any param dependencie
  const initialDependentSelectedValues: ParameterDependency[] = [];

  if (succeededCount === userQueries.length && paramDep.length === 0) {
    for (const q of userQueries) {
      const pName = q.data?.parameterName;
      if (pName && !paramDep.some((s) => s.parameterName === pName)) {
        if (
          q.data?.controlType === 'checkboxlist' &&
          q.data.dependsOn !== null
        ) {
          const firstValue = userQueries.filter(
            (x) => x.data?.parameterName === q.data?.dependsOn,
          )[0].data?.data[0].id;

          if (firstValue) {
            const t: ParameterDependency = {
              parameterName: q.data?.dependsOn,
              dependentParameterName: pName,
              value: firstValue.toString(),
            };
            initialDependentSelectedValues.push(t);
          }
        }
      }
    }

    if (initialDependentSelectedValues.length > 0) {
      setParamDep(initialDependentSelectedValues);
    }
  }

  // find any params that are not a dependancy of any other params and remove from paramDep
  // if (paramDep.length > 0) {
  //   const deleP: ParameterDependency[] = [];
  //   for (const dep of paramDep) {
  //     if (
  //       parameters.filter((x) => x.dependsOn === dep.parameterName).length === 0
  //     ) {
  //       deleP.push({
  //         parameterName: dep.parameterName,
  //         dependentParameterName: dep.dependentParameterName,
  //         value: dep.value,
  //       });
  //     }
  //   }

  //   if (deleP.length > 0) {
  //     let newparamDep = [...paramDep];
  //     for (const p of deleP) {
  //       const n = newparamDep.filter(
  //         (x) => x.parameterName !== p.parameterName,
  //       );
  //       newparamDep = [...n];
  //     }
  //     setParamDep(newparamDep);
  //   }
  // }

  const updatedParameterDependencies: ParameterDependency[] = [];
  for (const d of paramDep) {
    for (const s of selectedValues) {
      if (s.name !== d.parameterName) break;

      if (s.value !== d.value) {
        updatedParameterDependencies.push({
          parameterName: d.parameterName,
          dependentParameterName: d.dependentParameterName,
          value: s.value!,
        });
      }
    }
  }

  if (updatedParameterDependencies.length > 0) {
    setParamDep((prev) => {
      const n = prev.map((p) => {
        let nvalue = p.value;
        const exists = updatedParameterDependencies.some(
          (x) => x.parameterName === p.parameterName,
        );

        if (exists) {
          nvalue = updatedParameterDependencies.filter(
            (x) => x.parameterName === p.parameterName,
          )[0].value;
        }

        return { ...p, value: nvalue };
      });
      return n;
    });
  }

  function createControls(
    parameterName: string,
    controlType: string,
    results: ParameterQueryResult[],
  ) {
    console.log('controlType', controlType);
    if (controlType === 'dropdownlist') {
      return createDropdownList(results, parameterName);
    } else if (controlType === 'checkboxlist') {
      return createCheckboxList(results, parameterName);
    }
  }

  function createCheckboxList(
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

        const handleAllChecked = (controlId: string) => {
          setSelectedValues((prev) => {
            const newS = prev.map((p) => ({
              ...p,
              values: p.name === controlId ? [] : p.values,
            }));
            return newS;
          });
        };
        const handleItemsCheckedSnapshot = (
          controlId: string,
          checkedItems: { id: number }[],
        ) => {
          const newS = selectedValues.map((p) => ({
            ...p,
            values:
              p.name === controlId
                ? checkedItems.map((x) => x.id.toString())
                : p.values,
          }));

          if (!newS.some((x) => x.name === controlId)) {
            newS.push({
              name: controlId,
              values: checkedItems.map((x) => x.id.toString()),
            });
          }
          setSelectedValues(newS);
        };

        let listKey = parameterName;

        if (paramDep.some((x) => x.dependentParameterName === parameterName)) {
          listKey +=
            '_' +
            paramDep.filter((x) => x.dependentParameterName == parameterName)[0]
              .value;
        }

        return (
          <CheckBoxList
            key={listKey}
            controlId={parameterName}
            items={items}
            maxHeight={200}
            onAllItemsChecked={handleAllChecked}
            onItemsCheckedSnapshot={handleItemsCheckedSnapshot}
            tailWindBorderStyles="rounded-md border border-neutral-300"
          ></CheckBoxList>
        );
      }
    }
  }

  function createDropdownList(
    results: ParameterQueryResult[],
    parameterName: string,
  ) {
    if (results.some((x) => x.data?.parameterName == parameterName)) {
      const data = results.filter(
        (x) => x.data?.parameterName == parameterName,
      )[0].data;

      if (data) {
        const paramSelection: ParameterSelections | null = selectedValues.some(
          (x) => x.name === parameterName,
        )
          ? selectedValues.filter((x) => x.name === parameterName)[0]
          : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = data.data.map((d: any, i: number) => {
          const selected = paramSelection?.value === d.id.toString();
          return (
            <option key={i} value={d.id} selected={selected}>
              {d.text}
            </option>
          );
        });

        const onSaveSelectedValues = (e: ChangeEvent<HTMLSelectElement>) => {
          setSelectedValues((prev) => {
            if (!prev) return [];
            return prev?.map((p: ParameterSelections) => {
              return {
                ...p,
                value: p.name === parameterName ? e.target.value : p.value,
              };
            });
          });
        };

        if (parameters.some((x) => x.dependsOn === parameterName)) {
          const onSaveDependentValue = (e: ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            const depParam = parameters.filter(
              (x) => x.dependsOn === parameterName,
            )[0];
            if (
              paramDep?.some(
                (x) =>
                  x.parameterName === parameterName &&
                  x.dependentParameterName == depParam.name &&
                  x.value === value,
              )
            )
              return;

            setParamDep((prev) => {
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

          return (
            <Select
              onChange={(e) => {
                onSaveDependentValue(e);
                onSaveSelectedValues(e);
              }}
            >
              {options}
            </Select>
          );
        } else {
          return <Select onChange={onSaveSelectedValues}>{options}</Select>;
        }
      }
    }

    return null;
  }

  return (
    <div>
      {/* parameters <pre>{JSON.stringify(parameters)}</pre> */}
      paramDep: <pre>{JSON.stringify(paramDep)}</pre>
      selectedValues: <pre>{JSON.stringify(selectedValues)}</pre>
      {parameters.map((p, index) => {
        return (
          <div
            key={index}
            className="grid gap-2 grid-cols-[.3fr_1fr] mb-3 items-center"
          >
            <div className="self-start">{p.label}</div>
            <div>{createControls(p.name, p.controlType, userQueries)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportParameters;
