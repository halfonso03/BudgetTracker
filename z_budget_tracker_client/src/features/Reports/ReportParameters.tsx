import Select from '../../components/Select';
import CheckBoxList from '../../components/CheckBoxList';
import { useState, type ChangeEvent, type ChangeEventHandler } from 'react';
import Button from '../../components/Button';
import useParamOptionsQueries from '../../api/hooks/reports/useParamOptionsQueries';

type Props = {
  reportId: number;
  parameters: ReportParameter2[];
  onRunReport: (selectedValues: ParameterSelections[]) => void;
};



const ReportParameters = ({ reportId, parameters, onRunReport }: Props) => {
  // console.log('ReportParameters render');
  const [paramDep, setParamDep] = useState<ParameterDependency[]>([]);
  const [selectedValues, setSelectedValues] = useState<ParameterSelections[]>(
    [],
  );

  const { paramOptionsQueries } = useParamOptionsQueries(
    reportId,
    parameters,
    paramDep,
  );

  const succeededCount = paramOptionsQueries.filter((q) => q.isSuccess).length;
  const initialSelectedValues: ParameterSelections[] = [];

  if (
    succeededCount === paramOptionsQueries.length &&
    selectedValues.length === 0
  ) {
    for (const q of paramOptionsQueries) {
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

  if (selectedValues.length > 0) {
    for (const p of parameters) {
      if (!selectedValues.some((x) => x.name === p.name)) {
        if (p.controlType === 'checkboxlist') {
          const newS = [...selectedValues, { name: p.name, values: [] }];
          setSelectedValues(newS);
        }
      }
    }
  }

  // save any param dependencie
  const initialDependentSelectedValues: ParameterDependency[] = [];

  if (succeededCount === paramOptionsQueries.length && paramDep.length === 0) {
    for (const q of paramOptionsQueries) {
      const pName = q.data?.parameterName;
      if (pName && !paramDep.some((s) => s.parameterName === pName)) {
        if (
          q.data?.controlType === 'checkboxlist' &&
          q.data.dependsOn !== null
        ) {
          const firstValue = paramOptionsQueries.filter(
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
          data.data.map((d: any) => {
            let checked = false;

            // determine the selected values for the checkbox if any and update
            const param = parameters.filter((x) => x.name === parameterName)[0];
            if (
              param.controlType === 'checkboxlist' &&
              selectedValues.length &&
              selectedValues.some((x) => x.name === parameterName)
            ) {
              const sValues = selectedValues.filter(
                (x) => x.name === parameterName,
              )[0].values;

              if (sValues?.length == 0) {
                checked = true;
              } else {
                checked =
                  sValues!.some((x) => x.toString() === d.id.toString()) ??
                  false;
              }
            }
            return {
              id: d.id,
              name: d.text,
              checked: checked,
            };
          });

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
          const newS = selectedValues?.map((p: ParameterSelections) => {
            const param = parameters.filter((x) => x.name === p.name)[0];
            const resetSelections =
              param?.controlType === 'checkboxlist' &&
              param.dependsOn === parameterName;

            return {
              ...p,
              value: p.name === parameterName ? e.target.value : p.value,
              values: resetSelections ? [] : p.values,
            };
          });
          // onSelectedValueChange(newS);
          setSelectedValues(newS);
        };

        let onSaveDependentValue: ChangeEventHandler | null = null;

        if (parameters.some((x) => x.dependsOn === parameterName)) {
          onSaveDependentValue = (e: ChangeEvent<HTMLSelectElement>) => {
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
        }
        return (
          <div className="pl-1">
            <Select
              onChange={(e) => {
                onSaveDependentValue?.(e);
                onSaveSelectedValues(e);
              }}
            >
              {options}
            </Select>
          </div>
        );
      }
    }

    return null;
  }

  //   for (const p of parameters) {
  //   if (!selectedValues.some((x) => x.name === p.name)) {
  //     if (p.controlType === 'checkboxlist') {
  //       const newS1 = [...selectedValues, { name: p.name, values: [] }];
  //       setSelectedValues(newS1);
  //     } else if (p.controlType === 'dropdownlist') {
  //       const paramValues = userQueries
  //         .map((x) => x.data)
  //         .filter((x) => x?.parameterName === p.name)[0]!.data;
  //       console.log('paramValues', paramValues);
  //       const newS2 = [
  //         ...selectedValues,
  //         { name: p.name, value: paramValues[0].id.toString() },
  //       ];
  //       setSelectedValues(newS2);
  //     }
  //   }
  // }

  return (
    <div>
      {/* parameters <pre>{JSON.stringify(parameters)}</pre> */}
      {/* paramDep: <pre>{JSON.stringify(paramDep)}</pre>*/}
      {/* selectedValues: <pre>{JSON.stringify(selectedValues)}</pre> */}
      {parameters.map((p, index) => {
        return (
          <div
            key={index}
            className="grid grid-cols-[.3fr_1fr] mb-3 items-center"
          >
            <div className="self-start">{p.label}</div>
            <div>
              {createControls(p.name, p.controlType, paramOptionsQueries)}
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-[.3fr_1fr] mt-20 ">
        <div></div>
        <Button
          buttonSize={'medium'}
          onClick={() => {
            const reportSelections: ParameterSelections[] = [];
            for (const parameter of parameters) {
              if (selectedValues.some((x) => x.name === parameter.name)) {
                reportSelections.push(
                  selectedValues.filter((x) => x.name === parameter.name)[0],
                );
              }
            }
            onRunReport(reportSelections);
          }}
        >
          Run Report
        </Button>
      </div>
    </div>
  );
};

export default ReportParameters;
