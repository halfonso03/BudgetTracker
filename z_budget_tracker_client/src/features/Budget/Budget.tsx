/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from 'react-hook-form';
import useBudget from '../../api/hooks/useBudgets';
import { useParams } from 'react-router-dom';
import useInitiatives from '../../api/hooks/useInitiatives';
import useGrants from '../../api/hooks/useGrants';
import NumericArrayInput from '../../components/NumericArrayInput';
import { formatNumber } from '../../app/util';

type BudgetRow = {
  accountId: number;
  categoryId: number;
  amount: string;
  name: string;
};

type Budget = {
  rows: BudgetRow[];
};

const Budget = () => {
  const categories: Category[] = [];

  const { initiativeId, grantId } = useParams();

  const { data } = useBudget(+initiativeId!, +grantId!);
  const { data: initiative } = useInitiatives(+initiativeId!);
  const { data: grant } = useGrants(+grantId!);

  // get distinct categories
  for (const item of data?.items ?? []) {
    if (!categories.find((c) => c.name == item.category?.name)) {
      categories.push({
        id: item.category!.id,
        name: item.category!.name,
      });
    }
  }

  // get budgets rows
  const budgetRows: BudgetRow[] =
    data && data.items
      ? [
          ...data.items.map((item) => ({
            accountId: item.account_id,
            categoryId: item.category_id!,
            amount: formatNumber(item.amount),
            name: item.account.name,
          })),
        ]
      : [];

  // create total rows dynamically
  const totalRows: BudgetRow[] = categories.map((c) => {
    const formattedNumber = formatNumber(
      Number(
        data?.items
          .filter((x) => x.category_id == c.id)
          .map((i) => i.amount)
          .reduce((acc, cur) => acc + cur, 0),
      ),
    );

    const ret = {
      accountId: 999,
      categoryId: c.id,
      amount: formattedNumber,
      name: 'Total ' + c.name,
    };

    return { ...ret, amount: ret.amount.toString() };
  });

  // combine for later access
  const allRows = [...budgetRows, ...totalRows].sort(
    (a, b) => a.categoryId - b.categoryId || a.accountId - b.accountId,
  );

  // calculate the start and end index of each group for totaling
  let runningTotal = 0;
  const categoryAccountIndexes: Record<
    string,
    { startIndex: number; endIndex: number }
  > = {};
  for (const cat of categories) {
    const tempRows = allRows.filter(
      (a) => a.categoryId == cat.id && a.accountId !== 999,
    );
    categoryAccountIndexes[cat.id] = {
      startIndex: runningTotal,
      endIndex: tempRows.length + runningTotal,
    };
    runningTotal += tempRows.length + 1;
  }

  const { register, control, handleSubmit, getValues, setValue } =
    useForm<Budget>({
      values: {
        rows: allRows,
      },
    });

  const { fields } = useFieldArray({
    control,
    name: 'rows',
  });

  function parseFormattedNumber(formattedString: string) {
    // Removes everything except numbers, minus signs, and decimal points
    const cleanString = formattedString.toString().replace(/[^0-9.-]/g, '');
    return parseFloat(cleanString);
  }

  function handleCalculateTotal(
    categoryId: number,
    startIndex: number,
    totalsIndex: number,
  ) {
    let i: number = -1;
    const categoryTotal = fields
      .filter((x) => x.categoryId == categoryId && x.accountId !== 999)
      .map(() => {
        i += 1;
        const value = getValues(`rows.${startIndex + i}.amount`);
        // console.log('p', value, parseFormattedNumber(value));

        if (!value) return 0;
        return parseFormattedNumber(value);
      })
      .reduce((acc, cur) => cur + acc, 0);

    console.log(formatNumber(categoryTotal), totalsIndex);
    setValue(`rows.${totalsIndex}.amount`, formatNumber(categoryTotal));
  }

  function formatArrayFieldAmount(
    accountId: number,
    amount: string,
  ) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    let index = 0;
    while (allRows[index].accountId !== accountId) {
      index++;
    }

    if (formatter.format(+amount) === 'NaN') {
      setValue(`rows.${index}.amount`, '0.00');
      return;
    }

    setValue(`rows.${index}.amount`, formatNumber(+amount));
  }

  function removeNumberFormattingFromArrayField(
    accountId: number,
    amount: string,
  ) {
    let index = 0;
    while (allRows[index].accountId !== accountId) {
      index++;
    }

    const result = amount.replace(/(?<=\d),(?=\d)/g, '');
    setValue(`rows.${index}.amount`, result);
  }

  const onSubmit = (data: any) => {
    console.log('data', data);
  };

  if (!data) return <span>Loading...</span>;
  let indexRunningTotal = -1;

  return (
    <>
      <div>{initiative?.name}</div>
      <div>{grant?.name}</div>
      <div>{grant?.year}</div>


      <form onSubmit={handleSubmit(onSubmit)}>
        {categories.map((c) => {
          const categoryFields = fields.filter((x) => x.categoryId == c.id);

          const t2 = (
            <table className="border w-200" key={c.id}>
              <thead>
                <tr>
                  <td className="font-bold w-100">{c.name}</td>
                </tr>
                <tr>
                  <td className="text-start"></td>
                  <td className="text-start  font-bold">Amount</td>
                </tr>
              </thead>
              <tbody>
                {categoryFields.map((field, index) => {
                  indexRunningTotal += 1;

                  const amountRegister = register(
                    `rows.${indexRunningTotal}.amount`,
                  );

                  return (
                    <tr key={field.id}>
                      <td className="text-start">{field.name}</td>
                      <td className="text-start">
                        <NumericArrayInput
                          key={field.accountId}
                          register={amountRegister}
                          readOnly={index == categoryFields.length - 1}
                          disabled={index == categoryFields.length - 1}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            removeNumberFormattingFromArrayField(
                              field.accountId,
                              e.target.value,
                            );
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            amountRegister.onBlur(e);

                            formatArrayFieldAmount(
                              field.accountId,
                              e.target.value,
                            );

                            handleCalculateTotal(
                              field.categoryId,
                              categoryAccountIndexes[field.categoryId]
                                .startIndex,
                              categoryAccountIndexes[field.categoryId].endIndex,
                            );
                          }}
                        ></NumericArrayInput>
                        {/* <input
                          key={field.id}
                          type="text"
                          maxLength={10}
                          inputMode="decimal"
                          {...amountRegister}
                          readOnly={index == categoryFields.length - 1}
                          disabled={index == categoryFields.length - 1}
                          onKeyDown={handleOnKeyUp}
                          className={
                            `p-[.1rem] w-35 border text-end ` +
                            (index == categoryFields.length - 1
                              ? 'font-bold'
                              : '')
                          }
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            unFormatAmount(e.target.value, e, index);
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            amountRegister.onBlur(e);
                            formatAmount(e.target.value, index);
                            handleCalculateTotal(
                              field.categoryId,
                              categoryAccountIndexes[field.categoryId]
                                .startIndex,
                              categoryAccountIndexes[field.categoryId].endIndex,
                            );
                          }}
                        /> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
          return t2;
        })}

        <button type="submit" className="p-2 border ">
          Submit Form
        </button>
      </form>
    </>
  );
};
export default Budget;
