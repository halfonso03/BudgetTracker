import { useForm, useFieldArray } from 'react-hook-form';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGrants from '../../api/hooks/useGrants';
import {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import BudgetInputFields from './BudgetInputFields';
import useInitiatives from '../../api/hooks/useInitiatives';
import {
  formatArrayFieldAmount,
  removeNumberFormattingFromArrayField,
} from './utils';
import { ChevronDownSquare } from 'lucide-react';
import useBudgetDetails from '../../api/hooks/useBudgetDetails';
import BudgetHeader from './BudgetHeader';
import toast from 'react-hot-toast';
import { useBudgetActions } from '../../api/hooks/useBudgetActions';
import Button from '../../components/Button';

type totalsFieldNames = 'amount' | 'current_amount' | 'remaining_amount';
const userId = 2;

const Details = () => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const { updateBudget } = useBudgetActions();

  const bRef = useRef<HTMLDivElement | null>(null);
  const cRef = useRef<HTMLDivElement | null>(null);
  const rRef = useRef<HTMLDivElement | null>(null);

  const { year, initiativeId, grantId } = useParams();
  const { data: budget, isLoading } = useBudgetDetails(
    +initiativeId!,
    +grantId!,
  );
  const { data: initiatives } = useInitiatives();
  const initiative = initiatives?.filter((x) => x.id === +initiativeId!)[0];

  const { data: grants } = useGrants(+year!);
  const grant = grants?.filter((x) => x.id == +grantId!)[0];

  let budgetRows: BudgetInputRow[] = [];
  const categories: Category[] = [];

  const totalSpent =
    budget &&
    budget.account_balances &&
    formatCurrency(
      budget.account_balances
        .map((item) => item.spent_amount)
        .reduce((acc, cur) => acc + cur, 0),
    );

  // get distinct categories
  for (const item of budget?.account_balances ?? []) {
    if (!categories.find((c) => c.name == item.category?.name)) {
      categories.push({
        id: item.category!.id,
        name: item.category!.name,
      });
    }
  }

  // get budgets rows
  if (budget && budget.account_balances) {
    for (const cat of categories) {
      const accounts: BudgetInputRow[] = budget.account_balances
        .filter((i) => i.category_id == cat.id)
        .sort((a, b) => a.account_name.localeCompare(b.account_name))
        .map((item) => ({
          accountId: item.account_id,
          categoryId: item.category_id!,
          spent_amount: formatNumber(item.spent_amount),
          remaining_amount: formatNumber(item.amount - item.spent_amount),
          current_amount: formatNumber(item.current_amount),
          amount: formatNumber(item.amount),
          name: item.account_name,
          comment: item.comment,
        }));

      const totalBudgeted = budget?.account_balances
        .filter((x) => x.category_id == cat.id)
        .map((i) => i.amount)
        .reduce((acc, cur) => acc + cur, 0);

      const totalCurrent = budget?.account_balances
        .filter((x) => x.category_id == cat.id)
        .map((i) => i.current_amount)
        .reduce((acc, cur) => acc + cur, 0);

      const totalSpent = budget?.account_balances
        .filter((x) => x.category_id == cat.id)
        .map((i) => i.spent_amount)
        .reduce((acc, cur) => acc + cur, 0);

      const formattedTotalBudgeted = formatNumber(totalBudgeted);
      const formattedTotalSpent = formatNumber(totalSpent);
      const formatterTotalCurrent = formatNumber(totalCurrent);

      const totalRow = {
        accountId: 999,
        categoryId: cat.id,
        amount: formattedTotalBudgeted,
        current_amount: formatterTotalCurrent,
        spent_amount: formattedTotalSpent,
        remaining_amount: formatNumber(totalBudgeted + totalSpent),
        comment: '',
        name: 'Total',
      };

      budgetRows = [...budgetRows, ...accounts];
      budgetRows.push(totalRow);
    }
  }

  // combine for later access
  // calculate the start and end index of each group for totaling
  let runningTotal = 0;
  const categoryAccountIndexes: Record<
    string,
    { startIndex: number; totalIndex: number }
  > = {};

  for (const cat of categories) {
    const tempRows = budgetRows.filter((a) => a.categoryId == cat.id);
    categoryAccountIndexes[cat.id] = {
      startIndex: runningTotal,
      totalIndex: tempRows.length + runningTotal - 1,
    };
    runningTotal += tempRows.length;
  }

  const { register, control, handleSubmit, getValues, setValue } =
    useForm<BudgetRows>({
      values: {
        rows: budgetRows,
      },
    });

  const { fields } = useFieldArray({
    control,
    name: 'rows',
  });

  function handleCalculateTotal(
    categoryId: number,
    startIndex: number,
    totalsIndex: number,
  ) {
    let i: number = -1;
    const totalCurrent = fields
      .filter((x) => x.categoryId == categoryId && x.accountId !== 999)
      .map(() => {
        i += 1;
        const value = getValues(`rows.${startIndex + i}.amount`);
        if (!value) return 0;
        return parseFormattedNumber(value);
      })
      .reduce((acc, cur) => cur + acc, 0);

    setValue(`rows.${totalsIndex}.current_amount`, formatNumber(totalCurrent));

    i = -1;
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

    const totalSpent = budgetRows
      .filter((x) => x.categoryId == categoryId && x.accountId !== 999)
      .map((x) => parseFormattedNumber(x.spent_amount as string))
      .reduce((acc, curr) => acc + curr, 0);

    setValue(
      `rows.${totalsIndex}.remaining_amount`,
      formatNumber(categoryTotal + totalSpent),
    );
    calculateTotals();
  }

  function getTotalForField(fieldName: totalsFieldNames) {
    const b = categories
      .map((x) => {
        const rows = getValues('rows')[categoryAccountIndexes[x.id].totalIndex];
        return parseFormattedNumber(rows[fieldName] as string);
      })
      .reduce((acc, curr) => acc + curr, 0);
    return b;
  }

  const calculateTotals = useCallback(() => {
    const totalBudgeted = getTotalForField('amount');
    const totalCurrent = getTotalForField('current_amount');
    const totalRemaining = getTotalForField('remaining_amount');
    if (bRef && bRef.current)
      bRef.current!.innerHTML = formatCurrency(totalBudgeted);
    if (cRef && cRef.current)
      cRef.current!.innerHTML = formatCurrency(totalCurrent);
    if (rRef && rRef.current)
      rRef.current!.innerHTML = formatCurrency(totalRemaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, categoryAccountIndexes]);

  const onSubmit = (data: BudgetRows) => {
    const items: UpdateBudgetLineItemsRequest[] = data.rows
      .filter((x) => parseFormattedNumber(x.amount) > 0 && x.accountId != 999)
      .map((x) => ({
        amount: parseFormattedNumber(x.amount),
        initiativeId: +initiativeId!,
        grantId: +grantId!,
        accountId: x.accountId,
      }));

    const updateRequest: UpdateBudgetRequest = {
      updatedBy: userId,
      initiativeId: +initiativeId!,
      grantId: +grantId!,
      lineItems: items,
    };
    try {
      updateBudget(updateRequest);
    } catch (error) {
      toast.error(error as string);
      console.log(error);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  if (isLoading) return <span>Loading...</span>;
  if (!budget) return <span>Error</span>;

  let indexRunningTotal = -1;

  return (
    <div className="w-full mx-auto">
      <div className="mb-2 font-semibold text-2xl pb-5 text-neutral-700">
        Edit Budget
      </div>
      <div className="grid grid-cols-[.2fr_.5fr_1fr] mb-2 py-2 border-b border-b-neutral-200  border-t border-t-neutral-200">
        <div className="entity-label">Year</div>
        <div className="entity-label">Initiative</div>
        <div className="entity-label">Grant</div>
        <div className="entity-name">{grant?.year}</div>
        <div className="entity-name">{initiative?.name}</div>
        <div className="entity-name">{grant?.name}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-end mt-8 mb-4'>
          <Button type="submit"  variation='primary'>
            Save Budget
          </Button>
        </div>

        <BudgetHeader
          bRef={bRef}
          cRef={cRef}
          rRef={rRef}
          totalSpent={totalSpent}
        ></BudgetHeader>
        {categories.map((c, index) => {
          const amountFieldsForCategory = fields.filter(
            (x) => x.categoryId == c.id && x.accountId !== 999,
          );
          const totalFieldForCategory = fields.filter(
            (x) => x.categoryId == c.id && x.accountId === 999,
          );

          return (
            <div className="border border-neutral-200 mb-7" key={c.id}>
              <div className="flex justify-between bg-neutral-100 ">
                <div className="pl-3 py-2 font-bold">{c.name}</div>
                <div className="self-center mr-2">
                  <ChevronDownSquare
                    className={`text-blue-500 cursor-pointer ${expandedIndexes.some((x) => x == index) ? 'transition-transform duration-300 ease-in-out rotate-180 ' : 'transition-transform duration-300 ease-in-out rotate-0'}`}
                    onClick={() => {
                      if (expandedIndexes.some((x) => x == index)) {
                        setExpandedIndexes((prev) =>
                          prev.filter((x) => x !== index),
                        );
                      } else {
                        setExpandedIndexes((prev) => [...prev, index]);
                      }
                    }}
                  ></ChevronDownSquare>
                </div>
              </div>

              <div
                className={`  grid grid-cols-[.55fr_.25fr_.25fr_.25fr_.25fr_.25fr_.2fr]  pb-0 box ${expandedIndexes.some((x) => x == index) ? ' expanded border-t border-t-neutral-200' : ''}`}
                key={c.id}
              >
                <div className="pl-3 py-2 font-bold bg-neutral-100 text-neutral-600 border-b border-b-neutral-200">
                  Account
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-600 border-b border-b-neutral-200">
                  Budgeted
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-600 border-b border-b-neutral-200">
                  Current
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-600 border-b border-b-neutral-200">
                  Spent
                </div>
                <div className="py-2 text-end bg-neutral-100 font-bold text-neutral-600 border-b border-b-neutral-200">
                  Remaining
                </div>
                <div className="text-center py-2 bg-neutral-100 font-bold text-neutral-600 border-b border-b-neutral-200">
                  Comments
                </div>
                <div className="text-center py-2 bg-neutral-100 font-bold text-neutral-600 border-b border-b-neutral-200">
                  Actions
                </div>

                {amountFieldsForCategory.map((field) => {
                  indexRunningTotal += 1;

                  const amountRegister = register(
                    `rows.${indexRunningTotal}.amount`,
                  );

                  return (
                    <Fragment key={field.id}>
                      <BudgetInputFields
                        rowIndex={indexRunningTotal}
                        isLastRow={false}
                        accountId={field.accountId}
                        initiativeId={+initiativeId!}
                        grantId={+grantId!}
                        fieldName={field.name}
                        comment={field.comment}
                        budgetedAmount={field.amount}
                        currentAmount={field.current_amount as string}
                        spentAmount={field.spent_amount as string}
                        amountRegister={amountRegister}
                        currentAmountRegister={register(
                          `rows.${indexRunningTotal}.current_amount`,
                        )}
                        remainingAmountRegister={register(
                          `rows.${indexRunningTotal}.remaining_amount`,
                        )}
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                          const input = e.target as HTMLInputElement;
                          input.select();
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                          const input = e.target as HTMLInputElement;
                          input.select();
                          removeNumberFormattingFromArrayField(
                            setValue,
                            budgetRows,
                            field.accountId,
                            e.target.value,
                          );
                        }}
                        onBlur={({ e }) => {
                          amountRegister.onBlur(e);
                          formatArrayFieldAmount(
                            setValue,
                            budgetRows,
                            field.accountId,
                            e.target.value,
                          );
                          handleCalculateTotal(
                            field.categoryId,
                            categoryAccountIndexes[field.categoryId].startIndex,
                            categoryAccountIndexes[field.categoryId].totalIndex,
                          );
                        }}
                      ></BudgetInputFields>
                    </Fragment>
                  );
                })}
              </div>
              {totalFieldForCategory.map((field) => {
                indexRunningTotal += 1;

                return (
                  <div
                    className="border-t border-t-neutral-200 grid grid-cols-[.55fr_.25fr_.25fr_.25fr_.25fr_.25fr_.2fr] pb-0"
                    key={field.id}
                  >
                    <BudgetInputFields
                      rowIndex={indexRunningTotal}
                      isLastRow={true}
                      accountId={field.accountId}
                      initiativeId={+initiativeId!}
                      grantId={+grantId!}
                      fieldName={field.name}
                      comment={field.comment}
                      budgetedAmount={field.amount}
                      currentAmount={field.current_amount as string}
                      spentAmount={field.spent_amount as string}
                      amountRegister={register(
                        `rows.${indexRunningTotal}.amount`,
                      )}
                      currentAmountRegister={register(
                        `rows.${indexRunningTotal}.current_amount`,
                      )}
                      remainingAmountRegister={register(
                        `rows.${indexRunningTotal}.remaining_amount`,
                      )}
                    ></BudgetInputFields>
                  </div>
                );
              })}
            </div>
          );
        })}
      </form>
    </div>
  );
};
export default Details;

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

{
  /* <div
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
                      </div> */
}
