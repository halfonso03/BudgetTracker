/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useForm } from 'react-hook-form';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import BudgetInputFieldsNewBudget from './BudgetInputFieldsNewBudget';
import useCategories from '../../api/hooks/useCategories';
import useInitiatives from '../../api/hooks/useInitiatives';
import useGrants from '../../api/hooks/useGrants';
import { formatNumber, parseFormattedNumber } from '../../app/util';
import {
  formatArrayFieldAmount,
  removeNumberFormattingFromArrayField,
} from './utils';

type grp = {
  [key: string]: any;
  accounts: Account[];
};

const CreateBudget = () => {
  const { year, initiativeId, grantId } = useParams();
  const { data: grants } = useGrants(+year!);
  const { data: initiatives } = useInitiatives();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const initiative = initiatives?.filter((x) => x.id === +initiativeId!)[0];
  const grant = grants?.filter((x) => x.id == +grantId!)[0];

  let budgetRows: BudgetInputRow[] = [];
  let runningTotal = 0;

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
        comment: '',
      }));

      const totalRow = {
        accountId: 999,
        categoryId: categories.filter((x) => x.name == cat)[0].id,
        amount: '0.00',
        comment: '',
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

  if (loadingCategories) return <div>Loading...</div>;
  if (!categories) return <span>Error</span>;

  let indexRunningTotal = -1;

  return (
    <div className="w-[85%] mx-auto">
      <div className="grid grid-cols-[.2fr_.5fr_1fr] mb-6">
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
        {categories.map((c) => {
          const categoryFields = fields.filter((x) => x.categoryId == c.id);

          return (
            <div className="border border-neutral-200 mb-7" key={c.id}>
              <div className=" grid grid-cols-[.55fr_.25fr_.25fr]" key={c.id}>
                <div className="pl-3 py-2 bg-neutral-100 entity-label">
                  {c.name}
                </div>
                <div className="py-2 text-end bg-neutral-100 entity-label">
                  Budgeted Amount
                </div>
                <div className="text-center py-2 bg-neutral-100 entity-label">
                  Comments
                </div>

                {categoryFields.map((field, index) => {
                  // eslint-disable-next-line react-hooks/immutability
                  indexRunningTotal += 1;

                  const isLastRow = index == categoryFields.length - 1;

                  const amountRegister = register(
                    `rows.${indexRunningTotal}.amount`,
                  );

                  return (
                    <Fragment key={field.id}>
                      <BudgetInputFieldsNewBudget
                        isLastRow={isLastRow}
                        accountId={field.accountId}
                        initiativeId={+initiativeId!}
                        grantId={+grantId!}
                        fieldName={field.name}
                        comment={field.comment}
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
                      ></BudgetInputFieldsNewBudget>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button type="submit" className="p-2 border ">
          Submit Form
        </button>
      </form>
    </div>
  );
};
export default CreateBudget;
