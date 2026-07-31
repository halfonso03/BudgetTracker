/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from 'react-hook-form';
import useBudget from '../../api/hooks/useBudgets';
import { useParams } from 'react-router-dom';
import useGrants from '../../api/hooks/useGrants';
import { formatNumber, parseFormattedNumber } from '../../app/util';
import useInitiative from '../../api/hooks/useInitiative';
import type React from 'react';
import BudgetRow from './BudgetRow';

type BudgetRow = {
  accountId: number;
  categoryId: number;
  amount: string;
  name: string;
  comment: string;
};

type Budget = {
  rows: BudgetRow[];
};

const Budget = () => {
  const categories: Category[] = [];

  const { initiativeId, grantId } = useParams();

  const { data } = useBudget(+initiativeId!, +grantId!);
  const { data: initiative } = useInitiative(+initiativeId!);
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
            comment: item.comment,
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
      name: 'Total',
    };

    return { ...ret, amount: ret.amount.toString(), comment: '' };
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

  function formatArrayFieldAmount(accountId: number, amount: string) {
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
        if (!value) return 0;
        return parseFormattedNumber(value);
      })
      .reduce((acc, cur) => cur + acc, 0);

    setValue(`rows.${totalsIndex}.amount`, formatNumber(categoryTotal));
  }

  const onSubmit = (data: any) => {
    console.log('data1', data);
  };

  if (!data) return <span>Loading...</span>;

  let indexRunningTotal = -1;

  return (
    <div className="w-[85%] mx-auto">
      <div className="grid grid-cols-[1fr_1fr_1fr] mb-5">
        <div className="font-bold text-neutral-400">Initiative</div>
        <div className="font-bold text-neutral-400">Grant</div>
        <div className="font-bold text-neutral-400">Year</div>
        <div className="font-bold">{initiative?.name}</div>
        <div className="font-bold">{grant?.name}</div>
        <div className="font-bold">{grant?.year}</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {categories.map((c) => {
          const categoryFields = fields.filter((x) => x.categoryId == c.id);

          const grid = (
            <div className="border border-neutral-200 mb-7" key={c.id}>
              <div
                className=" grid grid-cols-[.7fr_.25fr_.25fr_.25fr_.2fr_.2fr]"
                key={c.id}
              >
                <div className="pl-3 py-2 font-bold bg-neutral-100 text-neutral-700">
                  {c.name}
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-500">
                  Budgeted
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-500">
                  Spent
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-500">
                  Remaining
                </div>
                <div className="text-end py-2 bg-neutral-100 font-bold text-neutral-500">Comments</div>
                <div className="text-center py-2 bg-neutral-100 font-bold text-neutral-500">Actions</div>

                {categoryFields.map((field, index) => {
                  indexRunningTotal += 1;

                  const amountRegister = register(
                    `rows.${indexRunningTotal}.amount`,
                  );

                  const isLastRow = index == categoryFields.length - 1;

                  return (
                    <>
                      <BudgetRow
                        isLastRow={isLastRow}
                        accountId={field.accountId}
                        initiativeId={+initiativeId!}
                        grantId={+grantId!}
                        fieldName={field.name}
                        comment={field.comment}
                        budgetedAmount={field.amount}
                        spentAmount={20}
                        amountRegister={amountRegister}
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                          const input = e.target as HTMLInputElement;
                          input.select();
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                          const input = e.target as HTMLInputElement;

                          input.select();

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
                            categoryAccountIndexes[field.categoryId].startIndex,
                            categoryAccountIndexes[field.categoryId].endIndex,
                          );
                        }}
                      ></BudgetRow>
                      {/* <div
                        className={`text-start pl-3 py-2  ${index == categoryFields.length - 1 ? 'bg-neutral-100' : ''}`}
                      >
                        {field.name}
                      </div>
                      <div
                        className={`text-start py-2  ${index == categoryFields.length - 1 ? 'bg-neutral-100' : ''}`}
                      >
                        <NumericArrayInput
                          key={field.accountId}
                          register={amountRegister}
                          readOnly={index == categoryFields.length - 1}
                          disabled={index == categoryFields.length - 1}
                          className={`${isLastRow ? 'border-0' : 'border-b-2 border-l-0 border-t-0 border-r-0 border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
                          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                            const input = e.target as HTMLInputElement;
                            input.select();
                          }}
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
                      </div>
                      <div
                        className={`text-start py-2  ${index == categoryFields.length - 1 ? 'bg-neutral-100' : ''}`}
                      ></div>
                      <div
                        className={`text-start py-2  ${index == categoryFields.length - 1 ? 'bg-neutral-100' : ''}`}
                      ></div>
                      <div
                        className={`text-center p-3 text-blue-500 text-sm self-center ${index == categoryFields.length - 1 ? 'bg-neutral-100' : ''}`}
                      >
                        <button
                          className={`cursor-pointer ${isLastRow ? 'opacity-0' : ''}`}
                          disabled={isLastRow}
                          tabIndex={-1}
                        >
                          0 Comments
                        </button>
                      </div> */}
                    </>
                  );
                })}
              </div>
            </div>
          );

          return grid;
        })}

        <button type="submit" className="p-2 border ">
          Submit Form
        </button>
      </form>
    </div>
  );
};
export default Budget;

// {

//             const table = (
//             <table className="border w-200" key={c.id}>
//               <thead>
//                 <tr>
//                   <td className="font-bold w-100">{c.name}</td>
//                 </tr>
//                 <tr>
//                   <td className="text-start w-100"></td>
//                   <td className="text-start font-bold w-100">Amount</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categoryFields.map((field, index) => {
//                   indexRunningTotal += 1;

//                   const amountRegister = register(
//                     `rows.${indexRunningTotal}.amount`,
//                   );

//                   return (
//                     <tr key={field.id}>
//                       <td className="text-start">{field.name}</td>
//                       <td className="text-start">
//                         <NumericArrayInput
//                           key={field.accountId}
//                           register={amountRegister}
//                           readOnly={index == categoryFields.length - 1}
//                           disabled={index == categoryFields.length - 1}
//                           onClick={(e: React.MouseEvent<HTMLInputElement>) => {
//                             const input = e.target as HTMLInputElement;
//                             input.select();
//                           }}
//                           onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
//                             removeNumberFormattingFromArrayField(
//                               field.accountId,
//                               e.target.value,
//                             );
//                           }}
//                           onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
//                             amountRegister.onBlur(e);
//                             formatArrayFieldAmount(
//                               field.accountId,
//                               e.target.value,
//                             );
//                             handleCalculateTotal(
//                               field.categoryId,
//                               categoryAccountIndexes[field.categoryId]
//                                 .startIndex,
//                               categoryAccountIndexes[field.categoryId].endIndex,
//                             );
//                           }}
//                         ></NumericArrayInput>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           );

/* <input
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
                        /> */
