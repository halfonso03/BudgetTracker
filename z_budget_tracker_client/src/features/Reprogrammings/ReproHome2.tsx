import { useState } from 'react';
import AddLineModal from './AddLineModal';
import useCategories from '../../api/hooks/useCategories';
import useGrants from '../../api/hooks/useGrants';
import useInitiatives from '../../api/hooks/useInitiatives';
import TransactionRow from './TransactionRow';
import { type Option } from 'react-dropdown';
import { formatCurrency } from '../../app/util';
import { useForm } from 'react-hook-form';
import NumericArrayInputGeneric from '../../components/NumericArrayInputGeneric';
import Button from '../../components/Button';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const ReproHome2 = () => {
  const queryClient = useQueryClient();

  const [addLineModelIsOpen, setAddLineModelIsOpen] = useState(false);
  const [lines, setLines] = useState<ReproLineItem[]>([]);
  const [savedBalances, setSavedBalances] = useState<RowBalance[]>([]);

  const { data: initiatives } = useInitiatives();
  const { data: categories, isLoading } = useCategories();
  const { data: grants } = useGrants(2026);

  const reprogRows: ReprogInputRow[] = lines.map((l) => {
    return {
      ...l,
      increase: l.increase ?? 0,
      decrease: l.decrease ?? 0,
      newAmount: l.currentAmount + +(l.increase ?? 0) - +(l.decrease ?? 0),
    };
  });

  const { register, getValues, setValue } = useForm<ReprogInputRows>({
    values: {
      rows: reprogRows,
    },
  });

  // const { fields } = useFieldArray({
  //   control,
  //   name: 'rows',
  // });

  function handleLineAdded(
    line: ReproLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) {
    setTimeout(() => {
      setAddLineModelIsOpen(false);
    }, 500);

    line.rowNumber = lines.length;

    setLines((prev) => {
      const newLines: ReproLineItem[] = prev.map(
        (l: ReproLineItem, i: number) => {
          const inc = getValues(`rows.${i}.increase`);
          const dec = getValues(`rows.${i}.decrease`);
          console.log('set lines', l.accountName);
          return {
            ...l,
            accountName: l.accountName,
            increase: inc,
            decrease: dec,
            newAmount: +l.currentAmount + +inc - +dec,
          };
        },
      );
      newLines.push(line);
      return newLines;
    });

    const balances = queryClient.getQueryData<
      { accountId: number; name: string; currentAmount: number }[]
    >([
      'repro_account_balances',
      key.initiativeId,
      key.grantId,
      key.categoryId,
    ]);

    if (
      !savedBalances.some(
        (b) =>
          b.key.initiativeId == key.initiativeId &&
          b.key.grantId == key.grantId &&
          b.key.categoryId == key.categoryId,
      )
    ) {
      setSavedBalances((prev) => {
        const newArray = [
          ...prev,
          {
            key: {
              ...key,
            },
            balances: balances!,
          },
        ];
        return newArray;
      });
    }
  }

  const handleAccountChange = (accountId: number, rowUuid: string) => {
    setLines((prev) => {
      const lines = prev.map((l: ReproLineItem, index) => {
        const inc = getValues(`rows.${index}.increase`);
        const dec = getValues(`rows.${index}.decrease`);

        if (rowUuid == l.uuid) {
          const currentAmount = savedBalances
            .filter(
              (b) =>
                b.key.initiativeId == l.initiativeId &&
                b.key.grantId == l.grantId &&
                b.key.categoryId == l.categoryId,
            )[0]
            .balances.filter((x) => x.accountId == accountId)[0].currentAmount;

          return {
            ...l,
            increase: inc,
            decrease: dec,
            newAmount: currentAmount + +inc - +dec,
            accountId: accountId,
            currentAmount: currentAmount,
          };
        } else {
          return {
            ...l,
            increase: inc,
            decrease: dec,
            newAmount: l.currentAmount + +inc - +dec,
          };
        }
      });

      return [...lines];
    });
  };

  function recalculate() {
    setLines((prev) => {
      const otherLines = prev.map((l, i) => {
        const inc = getValues(`rows.${i}.increase`);
        const dec = getValues(`rows.${i}.decrease`);
        return {
          ...l,
          increase: inc,
          decrease: dec,
          newAmount: +l.currentAmount + +inc - +dec,
        };
      });

      return [...otherLines];
    });
  }

  if (isLoading) return null;

  return (
    <div>
      <div className="mb-8">
        <Button
          buttonSize="small"
          onClick={() => {
            setAddLineModelIsOpen(true);
          }}
        >
          <Plus></Plus>
          Add Line
        </Button>
      </div>

      {/* <pre>{JSON.stringify(savedBalances)}</pre> */}

      <div className="grid grid-cols-[1.2fr_.8fr_.5fr_1.1fr_2.3fr_.3fr] gap-2">
        {lines.map((item, index) => {
          const balances = savedBalances.filter(
            (b) =>
              b.key.initiativeId === item.initiativeId &&
              b.key.grantId == item.grantId &&
              b.key.categoryId == item.categoryId,
          )[0].balances;
          // console.log('repro accountName', JSON.stringify(item.accountName));
          return (
            <TransactionRow
              key={item.uuid}
              lineItem={item}
              categories={categories}
              balances={balances}
              handleAccountChange={handleAccountChange}
              render={() => (
                <div className="flex">
                  <div className="text-center flex-1 px-1 text-neutral-600 self-center">
                    {formatCurrency(item.currentAmount)}
                  </div>
                  <NumericArrayInputGeneric
                    index={index}
                    setValue={setValue}
                    register={register(`rows.${index}.increase`)}
                    fieldName="increase"
                    readOnly={false}
                    disabled={false}
                    onBlur={recalculate}
                    classes={`flex-1 w-[98%] ml-2 p-1 pr-2 py-2 text-end  ${'border-b-2 border-neutral-300 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
                  />
                  <NumericArrayInputGeneric
                    index={index}
                    register={register(`rows.${index}.decrease`)}
                    fieldName="decrease"
                    setValue={setValue}
                    readOnly={false}
                    disabled={false}
                    onBlur={recalculate}
                    classes={`flex-1  w-[98%] ml-2 p-1 pr-2 py-2 text-end  ${' border-b-2 border-neutral-300 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
                  />
                  <div
                    className={`text-center flex-1 self-center text-neutral-600 px-1 ${item.newAmount < 0 ? 'text-red-500' : ''}`}
                  >
                    {formatCurrency(item.newAmount)}
                  </div>
                </div>
              )}
            ></TransactionRow>
          );
        })}
      </div>

      <AddLineModal
        isOpen={addLineModelIsOpen}
        initiatives={initiatives}
        grants={grants}
        categories={categories}
        onLineAdded={handleLineAdded}
        onCancel={() => {
          setTimeout(() => {
            setAddLineModelIsOpen(false);
          }, 500);
        }}
      ></AddLineModal>
    </div>
  );
};
export default ReproHome2;
