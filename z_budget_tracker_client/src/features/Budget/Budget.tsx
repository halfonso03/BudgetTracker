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
    //   // get distinct categories
    for (const item of data.items) {
      if (!categories.find((c) => c.name == item.category?.name)) {
        categories.push({
          id: item.category!.id,
          name: item.category!.name,
        });
      }
    }
  }

  const totals: BudgetRow[] = categories.map((c) => ({
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


  const allRows = [...budgetRows, ...totals];
  allRows.sort((a, b) => a.categoryId - b.categoryId || a.accountId - b.accountId)

  const { register, control, handleSubmit } = useForm<Budget>({
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

  // const handleCalculateTotal = () => {
  // Safely retrieve the current row's inputs
  // const amount = Number(getValues(`rows.${index}.amount`)) || 0;

  // const total = fields
  //   .slice(0, fields.length - 1)
  //   .map((_, index) => Number(getValues(`rows.${index}.amount`)))
  //   .reduce((acc, cur) => cur + acc, 0);

  // setValue(`rows.${fields.length - 1}.amount`, total);
  // };

  if (!data) return <span>Loading...</span>;
  let index2 = -1;

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
                index2 += 1;

                const amountRegister = register(`rows.${index2}.amount`, {
                  valueAsNumber: true,
                });

                return (
                  <tr key={index}>
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
                          // handleCalculateTotal(c.id);
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
