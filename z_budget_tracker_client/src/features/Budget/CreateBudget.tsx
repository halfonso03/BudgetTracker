/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useForm } from 'react-hook-form';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import BudgetInputFieldsNewBudget from './BudgetInputFieldsNewBudget';
import useCategories from '../../api/hooks/useCategories';
import useInitiatives from '../../api/hooks/useInitiatives';
import useGrants from '../../api/hooks/useGrants';
import {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import {
  formatArrayFieldAmount,
  removeNumberFormattingFromArrayField,
} from './utils';
import BudgetHeaderCreate from './BudgetHeaderCreate';
import { ChevronDownSquare } from 'lucide-react';
import { useBudgetActions } from '../../api/hooks/useBudgetActions';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const userId = 1;

type grp = {
  [key: string]: any;
  accounts: Account[];
};

const CreateBudget = () => {
  const bRef = useRef<HTMLDivElement | null>(null);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const { year, initiativeId, grantId } = useParams();
  const { data: grants } = useGrants(+year!);
  const { data: initiatives } = useInitiatives();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [canSubmitForm, setCanSubmitForm] = useState(false);
  const { createBudget } = useBudgetActions();

  const initiative = initiatives?.filter((x) => x.id === +initiativeId!)[0];
  const grant = grants?.filter((x) => x.id == +grantId!)[0];

  let budgetRows: BudgetInputRow[] = [];
  let runningTotal = 0;

  const [commentsList, setCommentsList] = useState<
    { accountId: number; text: string }[]
  >([]);

  const categoryAccountIndexes: Record<
    string,
    { startIndex: number; totalIndex: number }
  > = {};

  if (categories) {
    const groupedCategories: grp = categories.reduce(
      (accumulator: any, currentItem: Category) => {
        const key: string = currentItem.name;

        if (!accumulator[key]) {
          accumulator[key] = [];
        }
        accumulator[key].push([...currentItem.accounts!]);

        return accumulator;
      },
      {},
    );

    for (const cat in groupedCategories) {
      const value = groupedCategories[cat];

      const accounts: BudgetInputRow[] = value[0].map((item: Account) => ({
        accountId: item.id,
        categoryId: item.category_id!,
        amount: '0.00',
        name: item.name,
      }));

      const totalRow = {
        accountId: 999,
        categoryId: categories.filter((x) => x.name == cat)[0].id,
        amount: '0.00',
        name: 'Total',
      };

      budgetRows = [...budgetRows, ...accounts, totalRow];
    }

    for (const cat of categories) {
      const tempRows = budgetRows.filter((a) => a.categoryId == cat.id);
      categoryAccountIndexes[cat.id] = {
        startIndex: runningTotal,
        totalIndex: tempRows.length + runningTotal - 1,
      };
      runningTotal += tempRows.length;
    }
  }

  const { register, control, handleSubmit, setValue, getValues } =
    useForm<BudgetRows>({
      values: {
        rows: budgetRows,
      },
    });

  const { fields } = useFieldArray({
    control,
    name: 'rows',
  });

  function calculateTotalBudgeted() {
    const totalBudgeted = categories!
      .map((x: Category) => {
        return parseFormattedNumber(
          getValues(`rows.${categoryAccountIndexes[x.id].totalIndex}.amount`),
        );
      })
      .reduce((acc, curr) => acc + curr, 0);
    if (bRef && bRef.current)
      bRef.current!.innerHTML = formatCurrency(totalBudgeted);
  }

  const calculateTotals = useCallback(() => {
    calculateTotalBudgeted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, categoryAccountIndexes]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

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

    calculateTotalBudgeted();

    setCanSubmitForm(categoryTotal > 0);
  }

  const onSubmit = (data: BudgetRows) => {
    const t = commentsList.map((x) => x);
    const items: CreateBudgetLineItemsRequest[] = data.rows
      .filter((x) => parseFormattedNumber(x.amount) > 0 && x.accountId != 999)
      .map((x) => ({
        ...x,
        amount: parseFormattedNumber(x.amount),
        initiativeId: +initiativeId!,
        grantId: +grantId!,
      }));
    const createRequest: CreateBudgetRequest = {
      createdBy: userId,
      year: +year!,
      lineItems: items,
      comments: t,
    };

    try {
      createBudget(createRequest);
    } catch (error) {
      toast.error(error as string);
      console.log(error);
    }
  };

  function handleSaveComments(e: { accountId: number; text: string }) {
    try {
      if (commentsList.some((x) => x.accountId == e.accountId)) {
        if (!e.text) {
          setCommentsList((prev) => [
            ...prev.filter((x) => x.accountId != e.accountId),
          ]);
        } else {
          setCommentsList((prev) => {
            prev.filter((x) => x.accountId == e.accountId)[0].text = e.text;
            const newList = [...prev];
            return newList;
          });
        }
      } else {
        setCommentsList(prev => ([...prev, e]))
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  if (loadingCategories) return <div>Loading...</div>;
  if (!categories) return <span>Error</span>;

  let indexRunningTotal = -1;
  return (
    <div className="w-full mx-auto ">
      <div className="mb-2 font-semibold text-2xl pb-5 text-neutral-700">
        Create New Budget
      </div>
      <div className="grid grid-cols-[.2fr_.5fr_1fr] mb-2 py-2 border-b border-b-neutral-200  border-t border-t-neutral-200">
        <div className="entity-label">Year</div>
        <div className="entity-label">Initiative</div>
        <div className="entity-label">Grant</div>
        <div className="entity-name">{year}</div>
        <div className="entity-name">{initiative?.name}</div>
        <div className="entity-name">
          {grant?.name} - {grant?.fiduciary}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end mt-8 mb-2">
          <Button type="submit" variation="primary" disabled={!canSubmitForm}>
            Create Budget
          </Button>
        </div>
        <BudgetHeaderCreate bRef={bRef}></BudgetHeaderCreate>

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
                className={`grid grid-cols-[.55fr_.25fr_.25fr] box ${expandedIndexes.some((x) => x == index) ? ' expanded border-t border-t-neutral-200' : ''}`}
                key={c.id}
              >
                <div className="pl-3 py-2 bg-neutral-100 entity-name">
                  Account
                </div>
                <div className="py-2 text-end bg-neutral-100 text-neutral-600 font-bold">
                  Budgeted
                </div>
                <div className="text-center py-2 bg-neutral-100 text-neutral-600 font-bold">
                  Comments
                </div>

                {amountFieldsForCategory.map((field) => {
                  // eslint-disable-next-line react-hooks/immutability
                  indexRunningTotal += 1;

                  const amountRegister = register(
                    `rows.${indexRunningTotal}.amount`,
                  );

                  return (
                    <Fragment key={field.id}>
                      <BudgetInputFieldsNewBudget
                        isLastRow={false}
                        accountId={field.accountId}
                        initiativeId={+initiativeId!}
                        grantId={+grantId!}
                        fieldName={field.name}
                        budgetedAmount={field.amount}
                        amountRegister={amountRegister}
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
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
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
                        onCommentSaved={handleSaveComments}
                      ></BudgetInputFieldsNewBudget>
                    </Fragment>
                  );
                })}
              </div>
              {totalFieldForCategory.map((field) => {
                indexRunningTotal += 1;

                return (
                  <div
                    className="grid grid-cols-[.55fr_.25fr_.25fr] border-t border-t-neutral-200  "
                    key={field.id}
                  >
                    <BudgetInputFieldsNewBudget
                      isLastRow={true}
                      accountId={field.accountId}
                      initiativeId={+initiativeId!}
                      grantId={+grantId!}
                      fieldName={field.name}
                      budgetedAmount={field.amount}
                      amountRegister={register(
                        `rows.${indexRunningTotal}.amount`,
                      )}
                    ></BudgetInputFieldsNewBudget>
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
export default CreateBudget;
