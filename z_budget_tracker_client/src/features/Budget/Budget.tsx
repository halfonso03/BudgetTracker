/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from 'react-hook-form';
import useBudget from '../../api/hooks/useBudgets';
import { useParams } from 'react-router-dom';

type BudgetRow = {
  accountId: number;
  categoryId: number;
  amount: number;
  name: string;
};

type Budget = {
  rows: BudgetRow[];
};

const Budget = () => {
  const { initiativeId, grantId } = useParams();
  
  const { data } = useBudget(+initiativeId!, +grantId!);
  const categories: Category[] = [];

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
            amount: item.amount,
            name: item.account.name,
          })),
        ]
      : [];

  // create total rows dynamically
  const totalRows: BudgetRow[] = categories.map((c) => ({
    accountId: 999,
    categoryId: c.id,
    amount: Number(
      data?.items
        .filter((x) => x.category_id == c.id)
        .map((i) => i.amount)
        .reduce((acc, cur) => acc + cur, 0),
    ),
    name: 'Total ' + c.name,
  }));

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

  const handleCalculateTotal = (
    categoryId: number,
    startIndex: number,
    endIndex: number,
  ) => {
    let i: number = -1;
    const categoryTotal = fields
      .filter((x) => x.categoryId == categoryId && x.accountId !== 999)
      .map(() => {
        i += 1;
        const value = getValues(`rows.${startIndex + i}.amount`);
        if (!value) return 0;
        return value;
      })
      .reduce((acc, cur) => cur + acc, 0);

    setValue(`rows.${endIndex}.amount`, categoryTotal);
  };

  const onSubmit = (data: any) => {
    console.log('data', data);
  };

  if (!data) return <span>Loading...</span>;
  let indexRunningTotal = -1;

  return (
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
                  {
                    valueAsNumber: true,
                  },
                );

                return (
                  <tr key={field.id}>
                    <td className="text-start">{field.name}</td>
                    <td className="text-start">
                      <input
                        key={field.id}
                        type="number"
                        {...amountRegister}
                        readOnly={index == categoryFields.length - 1}
                        disabled={index == categoryFields.length - 1}
                        className={
                          `border text-end ` +
                          (index == categoryFields.length - 1
                            ? 'font-bold'
                            : '')
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          amountRegister.onBlur(e);
                          handleCalculateTotal(
                            field.categoryId,
                            categoryAccountIndexes[field.categoryId].startIndex,
                            categoryAccountIndexes[field.categoryId].endIndex,
                          );
                        }}
                      />
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
  );
};
export default Budget;
