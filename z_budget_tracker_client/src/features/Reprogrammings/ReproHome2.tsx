import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AlertCircle, BookOpenText, Plus, Save } from 'lucide-react';

import AddLineModal from './AddLineModal';
import useCategories from '../../api/hooks/useCategories';
import useGrants from '../../api/hooks/useGrants';
import useInitiatives from '../../api/hooks/useInitiatives';
import TransactionRow from './TransactionRow';
import {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import NumericArrayInputGeneric from '../../components/NumericArrayInputGeneric';
import Button from '../../components/Button';
import MenuIdProvider from '../../contexts/MenuIdContext';
import toast from 'react-hot-toast';

const ReproHome2 = () => {
  const queryClient = useQueryClient();

  const [addLineModelIsOpen, setAddLineModelIsOpen] = useState(false);
  const [lines, setLines] = useState<ReproLineItem[]>([]);
  const [savedBalances, setSavedBalances] = useState<RowBalance[]>([]);

  const { data: initiatives } = useInitiatives();
  const { data: categories, isLoading } = useCategories();
  const { data: grants } = useGrants(2026);
  const totalIncreaseRef = useRef<HTMLInputElement | null>(null);
  const totalDecreaseRef = useRef<HTMLInputElement | null>(null);

  const [hasAttemptedPost, setHasAttemptedPost] = useState(false);

  const [variance, setVariance] = useState<string>('');

  const DUP_LINES = 'There are duplicate lines.';
  const NO_INC_AND_NO_DEC_LINES =
    'There are lines with no increase and no decrease';
  const HAS_VARIANCE = 'There is a variance in the reprogramming';
  const LINES_WITH_INC_AND_DEC =
    'One or more lines has an increase and a decrease';
  const NEGATIVE_BALANCE = 'There is a negative balance';

  const reprogRows: ReprogInputRow[] = lines.map((l) => {
    return {
      ...l,
      increase: formatNumber(+(l.increase ?? 0.0)),
      decrease: formatNumber(+(l.decrease ?? 0.0)),
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

    const newLines: ReproLineItem[] = lines.map(
      (l: ReproLineItem, i: number) => {
        const inc = getValues(`rows.${i}.increase`);
        const dec = getValues(`rows.${i}.decrease`);
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

    setLines(newLines);

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
    calculateVariance();
    // setErrorMessages(newLines);
  }

  function handleAccountChange(accountId: number, rowUuid: string) {
    setLines((prev) => {
      const lines = prev.map((l: ReproLineItem, index) => {
        const inc = getValues(`rows.${index}.increase`);
        const dec = getValues(`rows.${index}.decrease`);

        if (rowUuid === l.uuid) {
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
    calculateVariance();
    // setErrorMessages(lines);
  }

  function handleDuplicateRow(uuid: string) {
    const newLine = lines.filter((x) => x.uuid === uuid)[0];
    setLines((prev) => {
      const newLines = [...prev, { ...newLine, uuid: crypto.randomUUID() }];
      return newLines;
    });
    calculateVariance();
  }

  function handleDeletRow(uuid: string) {
    setLines((prev) => {
      return prev.filter((x) => x.uuid !== uuid);
    });
    calculateVariance();
  }

  function recalculateNewAmounts() {
    const newLines = lines.map((l, i) => {
      const inc = parseFormattedNumber(
        getValues(`rows.${i}.increase`) as string,
      );
      const dec = parseFormattedNumber(
        getValues(`rows.${i}.decrease`) as string,
      );
      return {
        ...l,
        increase: inc,
        decrease: dec,
        newAmount: +l.currentAmount + +inc - +dec,
      };
    });
    setLines(newLines);
    calculateVariance();
  }

  function handleSaveComment(uuid: string, comment: string | null | undefined) {
    setLines((prev) => {
      const l = prev.map((line) => ({
        ...line,
        comment: line.uuid === uuid ? comment : line.comment,
      }));

      return l;
    });
  }

  function handleEditRow(uuid: string) {
    console.log('uuid', uuid);
  }

  const getTotalAmounts = useCallback((): { inc: number; dec: number } => {
    const inc = lines
      .map((l) => l.increase ?? 0)
      .reduce((acc, cum) => +acc! + +cum!, 0);
    const dec = lines
      .map((l) => l.decrease ?? 0)
      .reduce((acc, cum) => +acc! + +cum!, 0);

    return { inc: +inc, dec: +dec };
  }, [lines]);

  const calculateVariance = useCallback(() => {
    const { inc, dec } = getTotalAmounts();
    setVariance(formatCurrency(+(inc ?? 0) - +(dec ?? 0)));
  }, [getTotalAmounts]);

  function showSave() {
    const result = lines.length > 0;
    return result;
  }

  function canSave() {
    const result = lines.length > 0;
    return result;
  }

  function canPost() {
    let result = lines.length > 1;

    // no duplicate lines
    result = result && noDupLines(lines);

    // no variance
    const { inc: totalInc, dec: totalDec } = getTotalAmounts();
    result = result && totalInc - totalDec === 0;

    // amounts balance
    result = result && totalInc === totalDec;

    // no zero only lines
    result = result && noZeroOnlyLines(lines);

    // no lines with a value in inc and dec
    result = result && noLinesWithIncAndDecInValues(lines);

    // no negative balances
    result = result && noNegativeBalances(lines);

    return result;
  }

  function saveRepro() {}

  function postRepro() {
    if (canPost()) {
      console.log('123', 123);
    } else {
      console.log('456', 456);
      setHasAttemptedPost(true);
    }
  }

  const getErrors = useCallback(() => {
    const errors: string[] = [];

    if (!noDupLines(lines)) {
      errors.push(DUP_LINES);
    }

    if (!noZeroOnlyLines(lines)) {
      errors.push(NO_INC_AND_NO_DEC_LINES);
    }

    const { inc: totalInc, dec: totalDec } = getTotalAmounts();
    if (totalInc - totalDec !== 0) {
      errors.push(HAS_VARIANCE);
    }

    if (!noLinesWithIncAndDecInValues(lines)) {
      errors.push(LINES_WITH_INC_AND_DEC);
    }

    if (!noNegativeBalances(lines)) {
      errors.push(NEGATIVE_BALANCE);
    }

    return errors;
  }, [getTotalAmounts, lines]);

  useEffect(() => {
    const { inc, dec } = getTotalAmounts();
    if (totalIncreaseRef.current && totalDecreaseRef.current) {
      totalIncreaseRef.current.value = formatCurrency(+(inc ?? 0));
      totalDecreaseRef.current.value = formatCurrency(+(dec ?? 0));
    }
    calculateVariance();
    const errors = getErrors();

    if (errors.length > 0) {
      toast.custom(
        <div className="rounded-sm p-2 py-3 w-70 font-semibold border border-red-600 bg-red-500 text-neutral-50 flex gap-2">
          <AlertCircle></AlertCircle>
          <div className="self-center">{errors.length} errors</div>
        </div>,
        {
          position: 'top-right',
          duration: Infinity,
          id: 'errors',
        },
      );
    } else {
      toast.dismissAll();
    }

    // return () => toast.dismissAll('errors');
  }, [calculateVariance, getErrors, getTotalAmounts, lines]);

  if (isLoading) return null;

  return (
    <MenuIdProvider>
      <pre>{JSON.stringify(getErrors())}</pre>
      <div className="flex gap-2 mb-8 cursor-default">
        <Button
          buttonSize="small"
          onClick={() => {
            setAddLineModelIsOpen(true);
          }}
        >
          <Plus></Plus>
          Add Line
        </Button>
        {showSave() && (
          <Button buttonSize="small" disabled={!canSave()} onClick={saveRepro}>
            <Save className="mr-1"></Save>
            Save
          </Button>
        )}
        {showSave() && (
          <Button
            buttonSize="small"
            disabled={!canPost() || getErrors().length > 0}
            onClick={postRepro}
          >
            <BookOpenText className="mr-1"></BookOpenText>
            Post
          </Button>
        )}
      </div>
      {lines.length > 0 && (
        <div className="grid grid-cols-[1.35fr_.5fr_.5fr_1.1fr_2fr_.3fr] w-full py-1 border border-neutral-200 mb-5 shadow-sm">
          <div className="col-span-4"></div>
          <div className="flex justify-between gap-1">
            <div className="flex-1"></div>
            <div className="flex-1 text-end font-bold text-neutral-500 px-1">
              Increase
            </div>
            <div className="flex-1 text-end font-bold text-neutral-500 px-1">
              Decrease
            </div>
            <div className="flex-1 text-end font-bold text-neutral-500 px-1">
              Variance
            </div>
          </div>
          <div></div>
          <div className="col-span-4 pl-3 font-bold text-neutral-500 self-center">
            Total
          </div>
          <div className="flex justify-between gap-1">
            <div className="flex-1"></div>
            <div className="flex justify-end flex-1 ">
              <input
                readOnly={true}
                ref={totalIncreaseRef}
                disabled={true}
                className="border-0 text-neutral-800 font-semibold flex-1 w-[98%] px-1 pr-2  text-end focus:outline-none focus:ring-0 focus:ring-offset-0"
              ></input>
            </div>
            <div className="justify-end flex-1 ">
              <input
                readOnly={true}
                disabled={true}
                ref={totalDecreaseRef}
                className="border-0 text-neutral-800 font-semibold flex-1 w-[98%] px-1 pr-2  text-end  focus:outline-none focus:ring-0 focus:ring-offset-0"
              ></input>
            </div>
            <div className="flex-1">
              <input
                readOnly={true}
                disabled={true}
                value={variance}
                className={`text-blue-500 border-0 font-semibold flex-1 w-[98%] px-1 pr-2 text-end focus:outline-none focus:ring-0 focus:ring-offset-0`}
              ></input>
            </div>
          </div>
          <div></div>
        </div>
      )}
      {lines.length > 0 && (
        <div>
          <div className="grid grid-cols-[1.2fr_.5fr_.5fr_1.25fr_2fr_.3fr] gap-2 px-3 py-4 border border-transparent font-bold text-neutral-500">
            <div className="self-end">Initiative</div>
            <div className="self-end">Grant</div>
            <div className="self-end">Category</div>
            <div className="self-end">Account</div>
            <div className="flex justify-between ">
              <div className="text-center w-[25%]">Current Amount</div>
              <div className="self-end  text-end w-[25%] pr-2">Increase</div>
              <div className="self-end text-end w-[25%] pr-2">Decrease</div>
              <div className="text-center w-[25%] pr-2">New Amount</div>
            </div>
            <div></div>
          </div>
        </div>
      )}
      {/* <pre>{JSON.stringify(reprogRows)}</pre> */}
      {lines.map((item, index) => {
        const balances = savedBalances.filter(
          (b) =>
            b.key.initiativeId === item.initiativeId &&
            b.key.grantId == item.grantId &&
            b.key.categoryId == item.categoryId,
        )[0].balances;
        return (
          <div
            key={index}
            className="grid grid-cols-[1.2fr_.5fr_.5fr_1.2fr_2fr_.3fr] gap-2 px-3 py-1 border border-neutral-200 shadow-sm items-center mb-3"
          >
            <TransactionRow
              key={item.uuid}
              lineItem={item}
              categories={categories}
              balances={balances}
              accountChange={handleAccountChange}
              duplicateRow={handleDuplicateRow}
              deleteRow={handleDeletRow}
              editRow={handleEditRow}
              saveComment={handleSaveComment}
              render={() => (
                <div className="flex justify-between">
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
                    onBlur={recalculateNewAmounts}
                    classes={`flex-1 w-[98%] ml-2 p-1 pr-2 py-2 text-end border-b-2 border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0`}
                  />
                  <NumericArrayInputGeneric
                    index={index}
                    register={register(`rows.${index}.decrease`)}
                    fieldName="decrease"
                    setValue={setValue}
                    readOnly={false}
                    disabled={false}
                    onBlur={recalculateNewAmounts}
                    classes={`flex-1 w-[98%] ml-2 p-1 pr-2 py-2 text-end border-b-2 border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0`}
                  />
                  <div
                    className={`text-center flex-1 self-center text-neutral-600 px-1 ${item.newAmount < 0 ? 'text-red-500' : ''}`}
                  >
                    {formatCurrency(item.newAmount)}
                  </div>
                </div>
              )}
            ></TransactionRow>
          </div>
        );
      })}
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
    </MenuIdProvider>
  );
};

function noLinesWithIncAndDecInValues(lines: ReproLineItem[]): boolean {
  const lines2 = lines.map((l) => ({
    inc: +(l.increase ?? 0),
    dec: +(l.decrease ?? 0),
  }));

  return !lines2.some((x) => x.inc > 0 && x.dec > 0);
}

function noNegativeBalances(lines: ReproLineItem[]): boolean {
  const lines2 = lines
    .map((l) => ({
      cur: l.currentAmount,
      inc: +(l.increase ?? 0),
      dec: +(l.decrease ?? 0),
    }))
    .map((l) => l.cur + l.inc - l.dec);

  return !lines2.some((x) => x < 0);
}

function noZeroOnlyLines(lines: ReproLineItem[]): boolean {
  const lines2 = lines.map((l) => ({
    inc: +(l.increase ?? 0),
    dec: +(l.decrease ?? 0),
  }));

  return !lines2.some((x) => x.inc === 0 && x.dec === 0);
}

function noDupLines(lines: ReproLineItem[]): boolean {
  const counts: { name: string; count: number }[] = [];

  lines.map((l) => {
    const entity =
      l.initiativeName +
      '--' +
      l.grantName +
      '--' +
      l.categoryName +
      '--' +
      l.accountId.toString();
    if (counts.some((x) => x.name === entity)) {
      const currCount = counts.filter((x) => x.name === entity)[0];
      currCount.count += 1;
    } else {
      counts.push({ name: entity, count: 1 });
    }
  });
  return !counts.some((x) => x.count > 1);
}

export default ReproHome2;
