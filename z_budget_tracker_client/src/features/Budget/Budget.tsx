/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from 'react-hook-form';
import useBudget from '../../api/hooks/useBudgets';

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
  const { data } = useBudget();
  const categories: Category[] = [];

  if (data && data.items) {
    // get distinct categories
    for (const item of data.items) {
      if (!categories.find((c) => c.name == item.category?.name)) {
        categories.push({
          id: item.category!.id,
          name: item.category!.name,
        });
      }
    }
  }

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

  const allRows = [...budgetRows, ...totalRows].sort(
    (a, b) => a.categoryId - b.categoryId || a.accountId - b.accountId,
  );

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
      endIndex: tempRows.length + runningTotal - 1,
    };
    runningTotal += tempRows.length + 1;
  }

  const { register, control, handleSubmit, getValues, setValue } =
    useForm<Budget>({
      values: {
        rows: allRows,
      },
    });

  // 2. Pass the control object and array name into useFieldArray
  const { fields } = useFieldArray({
    control,
    name: 'rows',
  });

  const onSubmit = (data: any) => {
    console.log('data', data);
  };

  console.log('catge', categoryAccountIndexes);

  const handleCalculateTotal = (
    categoryId: number,
    startIndex: number,
    endIndex: number,
  ) => {
    // Safely retrieve the current row's inputs
    // const amount = Number(getValues(`rows.${index}.amount`)) || 0;

    let i: number = -1;
    const categoryTotal = fields
      .filter((x) => x.categoryId == categoryId && x.accountId !== 999)
      .map(() => {
        i += 1;
        const x2 = Number(getValues(`rows.${startIndex + i}.amount`));
        return x2;
      })
      .reduce((acc, cur) => cur + acc, 0);

    setValue(`rows.${endIndex + 1}.amount`, categoryTotal);
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
                <td className="font-bold">{c.name}</td>
              </tr>
              <tr>
                <td className="text-start">Account</td>
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
                      {indexRunningTotal}
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

      {/*  */}
      <button type="submit" className="p-2 border ">
        Submit Form
      </button>
    </form>
  );
};
export default Budget;
