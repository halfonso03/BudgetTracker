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

const ReproHome2 = () => {
  const [addLineModelIsOpen, setAddLineModelIsOpen] = useState(false);
  const [lines, setLines] = useState<ReproLineItem[]>([]);

  const { data: initiatives } = useInitiatives();
  const { data: categories, isLoading } = useCategories();
  const { data: grants } = useGrants(2026);

  const reprogRows: ReprogInputRow[] = lines
    .map((l) => {
      return {
        ...l,
        newAmount: l.newAmount ?? 0,
        increase: l.increase ?? 0,
        decrease: l.decrease ?? 0,
      };
    })
    .map((i) => ({
      ...i,
      newAmount: i.currentAmount + i.increase - i.decrease,
    }));

  const { register, getValues, setValue } = useForm<ReprogInputRows>({
    values: {
      rows: reprogRows,
    },
  });

  // const { fields } = useFieldArray({
  //   control,
  //   name: 'rows',
  // });

  function handleLineAdded(line: ReproLineItem) {
    setTimeout(() => {
      setAddLineModelIsOpen(false);
    }, 500);

    setLines((prev) => {
      const newLines: ReproLineItem[] = prev.map(
        (l: ReproLineItem, i: number) => {
          const inc = getValues(`rows.${i}.increase`);
          const dec = getValues(`rows.${i}.decrease`);
          return {
            ...l,
            increase: inc,
            decrease: dec,
            newAmount: l.currentAmount + inc - dec,
          };
        },
      );
      newLines.push(line);
      return newLines;
    });
  }

  const handleAccountChange = (option: Option, rowUuid: string) => {
    setLines((prev) => {
      const otherLines = prev.map((l, i) => {
        const inc = getValues(`rows.${i}.increase`);
        const dec = getValues(`rows.${i}.decrease`);
        return {
          ...l,
          increase: inc,
          decrease: dec,
          newAmount: +l.currentAmount + +inc - +dec,
          accountId: l.uuid == rowUuid ? +option.value : l.accountId,
          accountName:
            l.uuid == rowUuid ? option.label!.toString() : l.accountName,
        };
      });

      return [...otherLines];
    });
  };

  function calculateNewAmount() {
    setLines((prev) => {
      const otherLines = prev
        .map((l, i) => {
          const inc = getValues(`rows.${i}.increase`);
          const dec = getValues(`rows.${i}.decrease`);
          return {
            ...l,
            increase: inc,
            decrease: dec,
          };
        })
        .map((i) => ({
          ...i,
          newAmount: +i.currentAmount + +i.increase - +i.decrease,
        }));

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

      <div className="grid grid-cols-[1.2fr_.8fr_.5fr_1.1fr_2.3fr_.3fr]">
        {lines.map((item, index) => (
          <TransactionRow
            key={item.uuid}
            lineItem={item}
            categories={categories}
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
                  onBlur={calculateNewAmount}
                  classes={`flex-1 w-[98%] ml-2 p-1 pr-2 py-2 text-end  ${'border-b-2 border-neutral-300 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
                />
                <NumericArrayInputGeneric
                  index={index}
                  register={register(`rows.${index}.decrease`)}
                  fieldName="decrease"
                  setValue={setValue}
                  readOnly={false}
                  disabled={false}
                  onBlur={calculateNewAmount}
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
        ))}
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
