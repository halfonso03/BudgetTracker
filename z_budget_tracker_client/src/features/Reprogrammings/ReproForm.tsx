import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Plus,
  Save,
  BookOpenText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import Button from '../../components/Button';
import NumericArrayInputGeneric from '../../components/NumericArrayInputGeneric';
import MenuIdProvider from '../../contexts/MenuIdContext';
import TransactionRow from './TransactionRow';
import 'react-dropdown/style.css';
import { useReproMutations } from '../../api/hooks/repro/useReproMutations';
import useAuth from '../../contexts/useAuth';
import ConfirmModal from '../../components/ConfirmModal';
import IdHeader from './IdHeader';
import { useLocation } from 'react-router-dom';
import AddLineModal from './modals/AddLineModal';
import EditLineModal from './modals/EditLineModal';
import ErrorsModal from './modals/ErrorsModal';
import JustificaModal from './modals/JustificaModal';

const EDITED = 1;
const SAVED = 2;
const POSTED = 3;

export type ReproStatus = typeof EDITED | typeof SAVED | typeof POSTED;

// export type DirtyState = {
//   formValuesIsDirty: boolean;
//   numbersAresDirty: boolean;
// };

type ReproHeader = {
  id: number;
  justification: string;
  status: ReproStatus;
  createdBy?: string;
  createdById?: number;
  createDate?: Date;
  postedDate?: Date | null;
  postedBy?: string | null;
};

interface Props {
  repro: Repro;
  onInitialSave?: (newId: number) => void;
  onIsDirty: (dirty: boolean) => void;
  onSaved?: () => void;
}

type Selections = {
  uuid: string;
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
};

const ReproForm = ({ repro, onInitialSave, onIsDirty, onSaved }: Props) => {
  const DUP_LINES =
    'There are duplicate lines (Look for the duplicate selections for an Initiative, Grant, Category and Account)';
  const NO_INC_AND_NO_DEC_LINES =
    'There are lines with a $0 increase and a $0 decrease';
  const HAS_VARIANCE = 'There is a variance in the reprogramming';
  const LINES_WITH_INC_AND_DEC =
    'One or more lines has an increase and a decrease amount entered';
  const NEGATIVE_CURRENT_BALANCE =
    'There is a negative current balance in one or more lines';
  const NO_JUSTIFICATION = 'Justification has not been entered';
  const NEGATIVE_REMAINING_BALANCE =
    'There is a negative remaining balance in one or more lines';

  const { userId, loginId } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const created = location.state?.created ? location.state.created : false;

  const [addLineModalIsOpen, setAddLineModalIsOpen] = useState(false);
  const [editSelections, setEditSelections] = useState<Selections | null>(null);
  const [justModalIsOpen, setJustModalIsOpen] = useState(
    location.state &&
      location.state.ids !== undefined &&
      location.state.ids !== null
      ? true
      : false,
  );
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [confirmPostModalIsOpen, setConfirmPostModal] =
    useState<boolean>(false);
  // const [isDirtyState, setIsDirtyState] = useState<DirtyState>({
  //   formValuesIsDirty: false,
  //   numbersAresDirty: false,

  if (repro.year === 0) throw new Error('no year');

  const [reproHeader, setReproHeader] = useState<ReproHeader>({
    id: repro.id,
    justification: repro.justification,
    status: repro.posted ? POSTED : SAVED,
    postedDate: repro.postedDate,
    postedBy: repro.postedBy,
  });

  const [lines, setLines] = useState<ReproLineItem[]>(
    repro.lineItems.map((l) => {
      const remainingAmount =
        repro.rowBalances
          ?.filter(
            (x) =>
              x.key.initiativeId == l.initiativeId &&
              x.key.grantId == l.grantId &&
              x.key.categoryId == l.categoryId,
          )[0]
          .balances.filter((x) => x.accountId == l.accountId)[0]
          .remainingAmount ?? 0;

      return {
        ...l,
        remainingAmount: remainingAmount,
        newAmount: l.currentAmount + +(l.increase ?? 0) - +(l.decrease ?? 0),
        newRemainingAmount:
          remainingAmount + +(l.increase ?? 0) - +(l.decrease ?? 0),
      };
    }),
  );
  const [savedBalances, setSavedBalances] = useState<ReproRowBalance[]>(
    repro && repro.rowBalances ? repro.rowBalances! : [],
  );
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

  const { createRepro, updateRepro } = useReproMutations();

  const getTotalAmounts = useCallback((): { inc: string; dec: string } => {
    const inc = lines
      .map((l) => l.increase ?? 0)
      .reduce((acc, cum) => +acc! + +cum!, 0);
    const dec = lines
      .map((l) => l.decrease ?? 0)
      .reduce((acc, cum) => +acc! + +cum!, 0);

    return { inc: Number(inc).toFixed(2), dec: Number(dec).toFixed(2) };
  }, [lines]);

  const getErrors = useCallback(() => {
    const errors: string[] = [];

    if (!noDupLines(lines)) {
      errors.push(DUP_LINES);
    }

    if (!noZeroOnlyLines(lines)) {
      errors.push(NO_INC_AND_NO_DEC_LINES);
    }

    const { inc: totalInc, dec: totalDec } = getTotalAmounts();
    if (+totalInc - +totalDec !== 0) {
      errors.push(HAS_VARIANCE);
    }

    if (!noLinesWithIncAndDecInValues(lines)) {
      errors.push(LINES_WITH_INC_AND_DEC);
    }

    if (!noNegativeBalances(lines)) {
      errors.push(NEGATIVE_CURRENT_BALANCE);
    }

    if (hasNegativeRemainingBalances(lines)) {
      errors.push(NEGATIVE_REMAINING_BALANCE);
    }

    if (
      !reproHeader.justification ||
      reproHeader.justification.trim().length === 0
    ) {
      errors.push(NO_JUSTIFICATION);
    }

    return errors;
  }, [getTotalAmounts, lines, reproHeader.justification]);

  const { inc, dec } = getTotalAmounts();

  useEffect(() => {
    const errors = getErrors();

    if (
      errors.length > 0 &&
      lines.length > 0 &&
      reproHeader.status !== POSTED
    ) {
      toast.custom(
        <div className="animate-right-to-in  rounded-sm p-4 shadow-md w-70 font-semibold  bg-red-500 text-neutral-50 flex gap-2">
          <AlertCircle></AlertCircle>
          <div
            className="self-center hover:underline underline-offset-2 cursor-pointer"
            onClick={() => setErrorModalOpen(true)}
          >
            {errors.length} error{errors.length > 1 && <span>s</span>}
          </div>
        </div>,
        {
          position: 'top-right',
          duration: Infinity,
          id: 'errors',
        },
      );
    }
    // else {
    //   toast.remove();
    // }

    return () => {
      if (
        errors.length > 0 &&
        lines.length > 0 &&
        reproHeader.status !== POSTED
      )
        toast.remove();
    };
  }, [getErrors, getTotalAmounts, lines, reproHeader.status]);

  function handleLineAdded(
    newLine: ReproLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) {
    setTimeout(() => setAddLineModalIsOpen(false), 500);
    const newLines: ReproLineItem[] = lines.map(
      (l: ReproLineItem, i: number) => {
        const inc = getValues(`rows.${i}.increase`);
        const dec = getValues(`rows.${i}.decrease`);
        return {
          ...l,
          rowId: i,
          accountName: l.accountName,
          increase: inc,
          decrease: dec,
          newAmount: +l.currentAmount + +inc - +dec,
        };
      },
    );
    newLines.push({ ...newLine, rowId: newLines.length });

    setLines(newLines);

    const balances = queryClient.getQueryData<
      {
        accountId: number;
        accountName: string;
        currentAmount: number;
        remainingAmount: number;
      }[]
    >([
      'repro_account_balances',
      key.initiativeId,
      key.grantId,
      key.categoryId,
    ]);

    if (
      !savedBalances ||
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

    onIsDirty(true);
  }

  function handleLineUpdated(
    updatedLine: ReproLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) {
    setTimeout(() => {
      setEditSelections(null);
    }, 500);

    const newLines = lines.map((l: ReproLineItem, i: number) => {
      const inc = getValues(`rows.${i}.increase`);
      const dec = getValues(`rows.${i}.decrease`);

      return {
        ...l,
        rowId: i,
        initiativeId:
          l.uuid === updatedLine.uuid
            ? updatedLine.initiativeId
            : l.initiativeId,
        initiativeName:
          l.uuid === updatedLine.uuid
            ? updatedLine.initiativeName
            : l.initiativeName,
        grantId: l.uuid === updatedLine.uuid ? updatedLine.grantId : l.grantId,
        grantName:
          l.uuid === updatedLine.uuid ? updatedLine.grantName : l.grantName,
        categoryId:
          l.uuid === updatedLine.uuid ? updatedLine.categoryId : l.categoryId,
        categoryName:
          l.uuid === updatedLine.uuid
            ? updatedLine.categoryName
            : l.categoryName,
        accountId:
          l.uuid === updatedLine.uuid ? updatedLine.accountId : l.accountId,
        accountName:
          l.uuid === updatedLine.uuid ? updatedLine.accountName : l.accountName,
        increase: inc,
        decrease: dec,
        currentAmount:
          l.uuid === updatedLine.uuid
            ? updatedLine.currentAmount
            : l.currentAmount,
        newAmount:
          (l.uuid === updatedLine.uuid
            ? updatedLine.currentAmount
            : l.currentAmount) +
          +inc -
          +dec,
        newRemainingAmount:
          l.uuid === updatedLine.uuid
            ? updatedLine.remainingAmount + +inc - +dec
            : l.newRemainingAmount,
      };
    });

    setLines(newLines);

    const balances = queryClient.getQueryData<
      {
        accountId: number;
        accountName: string;
        currentAmount: number;
        remainingAmount: number;
      }[]
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

    onIsDirty(true);
  }

  function handleAccountChange(accountId: number, rowUuid: string) {
    setLines((prev) => {
      const lines = prev.map((l: ReproLineItem, index) => {
        const inc = getValues(`rows.${index}.increase`);
        const dec = getValues(`rows.${index}.decrease`);
        if (rowUuid === l.uuid) {
          const { currentAmount, remainingAmount } = savedBalances
            .filter(
              (b) =>
                b.key.initiativeId == l.initiativeId &&
                b.key.grantId == l.grantId &&
                b.key.categoryId == l.categoryId,
            )[0]
            .balances.filter((x) => x.accountId == accountId)[0];

          return {
            ...l,
            accountId: accountId,
            increase: inc,
            decrease: dec,
            newAmount: currentAmount + +inc - +dec,
            currentAmount: currentAmount,
            newRemainingAmount: remainingAmount + +inc - +dec,
          };
        } else {
          return {
            ...l,
            increase: inc,
            decrease: dec,
            newAmount: l.currentAmount + +inc - +dec,
            newRemainingAmount: l.remainingAmount + +inc - +dec,
          };
        }
      });

      return [...lines];
    });

    onIsDirty(true);
  }

  function handleDuplicateRow(uuid: string) {
    const newLine = lines.filter((x) => x.uuid === uuid)[0];

    setLines((prev) => {
      const newLines = [
        ...prev,
        { ...newLine, rowId: prev.length, uuid: crypto.randomUUID() },
      ];
      return newLines;
    });

    onIsDirty(true);
  }

  function handleDeletRow(uuid: string) {
    setLines((prev) => {
      const newLines = prev
        .filter((x) => x.uuid !== uuid)
        .map((l: ReproLineItem, i: number) => ({ ...l, rowId: i }));
      return newLines;
    });
    onIsDirty(true);
  }

  function recalculateNewAmounts() {
    const newLines = lines.map((l, i) => {
      const inc = parseFormattedNumber(
        getValues(`rows.${i}.increase`) as string,
      );
      const dec = parseFormattedNumber(
        getValues(`rows.${i}.decrease`) as string,
      );

      const { currentAmount, remainingAmount } = savedBalances
        .filter(
          (b) =>
            b.key.initiativeId == l.initiativeId &&
            b.key.grantId == l.grantId &&
            b.key.categoryId == l.categoryId,
        )[0]
        .balances.filter((x) => x.accountId == l.accountId)[0];

      return {
        ...l,
        increase: inc,
        decrease: dec,
        newAmount: currentAmount + +inc - +dec,
        newRemainingAmount: remainingAmount + +inc - +dec,
      };
    });
    setLines(newLines);
    onIsDirty(true);
  }

  function handleSaveComment(uuid: string, comment: string | null | undefined) {
    setLines((prev) => {
      const l = prev.map((line) => ({
        ...line,
        comment: line.uuid === uuid ? (comment ?? '') : line.comment,
      }));

      return l;
    });
    onIsDirty(true);
  }

  function handleEditRow(uuid: string) {
    const lineToEdit = lines.filter((x) => x.uuid == uuid)[0];
    setEditSelections({
      uuid: uuid,
      initiativeId: lineToEdit.initiativeId,
      grantId: lineToEdit.grantId,
      categoryId: lineToEdit.categoryId,
      accountId: lineToEdit.accountId,
    });
  }

  function canSave() {
    let result = lines.length > 0;

    // no duplicate lines
    result = result && noDupLines(lines);

    result = result && reproHeader.status !== POSTED;

    result =
      result &&
      reproHeader.justification !== null &&
      reproHeader.justification.trim().length > 0;

    return result;
  }

  function canPost() {
    let result = lines.length > 1;

    // no duplicate lines
    result = result && noDupLines(lines);

    // no variance
    const { inc: totalInc, dec: totalDec } = getTotalAmounts();
    result = result && +totalInc - +totalDec === 0;

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

  function onServerCreateSuccess(
    posted: boolean,
    newId: number,
    createDate: Date,
    postedDate: Date | null,
  ) {
    const message = posted ? 'Reprogramming Posted.' : 'Reprogramming Saved.';
    toast.success(message, {
      duration: 1500,
    });

    setReproHeader((prev) => {
      console.log('id', newId);
      console.log('userId', userId);
      console.log('loginid', loginId);

      return {
        ...prev,
        id: newId,
        createdById: +userId!,
        createdBy: loginId!,
        createDate: createDate,
        status: posted ? POSTED : SAVED,
        postedDate: postedDate,
        postedBy: posted ? loginId : '',
      };
    });

    console.log('123', 123);
  }

  function onServerUpdateSuccess(
    posted: boolean,
    postedDate: Date | null = null,
  ) {
    setReproHeader((prev) => {
      return {
        ...prev,
        status: posted ? POSTED : SAVED,
        postedDate: postedDate,
        postedBy: posted ? loginId : '',
      };
    });
    const message = posted ? 'Reprogramming Posted.' : 'Reprogramming Saved.';

    console.log('message', message);
    toast.success(message, {
      duration: 1500,
    });
  }

  function handleSaveJust(text: string) {
    setReproHeader((prev) => ({
      ...prev,
      justification: text,
      status: EDITED,
    }));
    setTimeout(() => setJustModalIsOpen(false), 500);
    onIsDirty(true);
  }

  async function saveReproButtonClick() {
    try {
      const lineItems = lines.map((l) => ({
        ...l,
        increase: parseFormattedNumber(l.increase?.toString() ?? '0.00'),
        decrease: parseFormattedNumber(l.decrease?.toString() ?? '0.00'),
      }));

      if (reproHeader.id === 0) {
        sendCreateRepro(lineItems);
      } else {
        sendUpdateRepro(lineItems);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async function onConfirmPost() {
    const lineItems = lines.map((l) => ({
      rowId: l.rowId,
      initiativeId: l.initiativeId,
      grantId: l.grantId,
      categoryId: l.categoryId,
      accountId: l.accountId,
      comment: l.comment,
      increase: parseFormattedNumber(l.increase?.toString() ?? '0.00'),
      decrease: parseFormattedNumber(l.decrease?.toString() ?? '0.00'),
    }));

    if (reproHeader.id === 0) {
      sendCreateRepro(lineItems, true);
    } else {
      sendUpdateRepro(lineItems, true);
    }
  }

  async function sendCreateRepro(
    lineItems: ReproLineItemRequest[],
    posted: boolean = false,
  ) {
    const reproToSave: CreateReproRequest = {
      createdById: userId!,
      posted: posted,
      justification: reproHeader.justification,
      lineItems: lineItems,
    };
    await createRepro.mutateAsync(reproToSave, {
      onSuccess: (id) => {
        queryClient.invalidateQueries({ queryKey: ['repro', id] });
        // queryClient.invalidateQueries({ queryKey: ['repro_search'] });

        const postedDate = new Date();
        const createDate = new Date();

        queryClient.setQueryData<Repro>(['repro', id], () => ({
          ...reproToSave,
          id: id,
          year: repro.year,
          justification: reproHeader.justification,
          createdBy: loginId!,
          createDate: createDate,
          posted: posted,
          postedDate: posted ? postedDate : null,
          postedBy: posted ? loginId! : null,
          postedById: posted ? userId! : null,
          lineItems: lines.map((l) => {
            return {
              ...l,
              comment: l.comment ?? '',
              newRemainingAmount:
                l.remainingAmount + +(l.increase ?? 0) - +(l.decrease ?? 0),
              newAmount:
                l.currentAmount + +(l.increase ?? 0) - +(l.decrease ?? 0),
            };
          }),
          rowBalances: savedBalances,
        }));

        // const message = posted
        //   ? 'Reprogramming Posted.'
        //   : 'Reprogramming Saved.';
        // toast.success(message, {
        //   duration: 1500,
        // });

        //    id: id !== 0 ? id : prev.id,
        // createdById: id !== 0 : +userId : +prev.createdById,
        //
        // ,
        //
        onServerCreateSuccess(
          posted,
          id,
          createDate,
          posted ? postedDate : null,
        );
        onInitialSave?.(id);
        onSaved?.();
      },
    });
  }

  async function sendUpdateRepro(
    lineItems: ReproLineItemRequest[],
    posted: boolean = false,
  ) {
    const reproToSave: UpdateReproRequest = {
      id: reproHeader.id,
      updatedById: userId!,
      posted: posted,
      justification: reproHeader.justification,
      lineItems: lineItems,
    };
    await updateRepro.mutateAsync(reproToSave, {
      onSuccess: () => {
        // queryClient.setQueryData<Repro>(
        //   ['repro', reproHeader.id],
        //   (oldData: any) => {
        //     console.log('oldData', oldData);
        //     return {
        //       ...oldData,
        //       lineItems: lines.map((l) => {
        //         return {
        //           ...l,
        //           newAmount:
        //             l.currentAmount + +(l.increase ?? 0) - +(l.decrease ?? 0),
        //         };
        //       }),
        //       rowBalances: savedBalances,
        //     };
        //   },
        // );

        const postedDate = new Date();

        onServerUpdateSuccess(posted, posted ? postedDate : null);
        onSaved?.();
      },
    });
  }

  return (
    <MenuIdProvider>
      {/* <pre>{JSON.stringify(lines)}</pre> */}
      <div>
        {!userId && (
          <div className="text-xl p-1 text-red-500 font-semibold">
            Your are not logged in!
          </div>
        )}

        <div className="flex mb-12 justify-between text-neutral-400 mr-3 mt-14 ">
          <div
            className={`flex gap-2 cursor-default ${reproHeader.status !== +POSTED ? '' : 'opacity-0 cursor-none'}`}
          >
            {repro !== undefined && (
              <Button
                buttonSize="small"
                onClick={() => {
                  setAddLineModalIsOpen(true);
                }}
              >
                <Plus></Plus>
                Add Line
              </Button>
            )}
            <Button
              buttonSize="small"
              disabled={!canSave()}
              onClick={saveReproButtonClick}
            >
              <Save className="mr-1"></Save>
              Save
            </Button>
            <Button
              buttonSize="small"
              disabled={
                !canPost() ||
                getErrors().length > 0 ||
                reproHeader.status === Number(POSTED)
              }
              onClick={() => setConfirmPostModal(true)}
            >
              <BookOpenText className="mr-1"></BookOpenText>
              Post
            </Button>
          </div>
          <Button
            className="flex gap-1 cursor-pointer hover:text-neutral-600 "
            onClick={() => setJustModalIsOpen(true)}
          >
            {reproHeader.status === Number(POSTED) ? (
              <div className="self-center">View Justification</div>
            ) : (
              <div className="self-center">Justification</div>
            )}
            {reproHeader.justification?.trim() === '' ? (
              <AlertTriangle
                className="self-center text-orange-300"
                size={17}
              ></AlertTriangle>
            ) : (
              <CheckCircle2
                className="self-center text-green-500"
                size={19}
              ></CheckCircle2>
            )}
          </Button>
        </div>

        <div className="flex justify-between mb-12 border-b border-b-neutral-200 pb-2 ">
          <IdHeader
            id={reproHeader.id}
            status={reproHeader.status}
            created={created}
          ></IdHeader>

          {reproHeader.status === POSTED && (
            <div className="flex gap-12 mr-4  ">
              <div className="flex gap-3 font-semibold">
                <div className=" text-neutral-500">POSTED ON</div>
                <div>
                  {reproHeader.postedDate
                    ? formatDate(reproHeader.postedDate)
                    : ''}
                </div>
              </div>
              <div className="flex gap-3 font-semibold">
                <div className=" text-neutral-500">POSTED BY</div>
                <div>{reproHeader.postedBy}</div>
              </div>
            </div>
          )}
        </div>

        {reproHeader.status === POSTED && (
          <div className="flex gap-10 px-3 py-1 border-b border-neutral-200 mb-8 font-semibold text-neutral-500 ">
            <div>Total</div>
            <div className="text-neutral-900">{inc}</div>
            <div></div>
          </div>
        )}

        {lines.length > 0 && reproHeader.status !== POSTED && (
          <div className=" grid grid-cols-[1.2fr_.5fr_.5fr_1.25fr_2fr_.3fr] gap-2 px-3 py-1 border-b border-neutral-200 mb-8  text-neutral-600 font-semibold">
            <div className="self-end col-span-4 "></div>
            <div className="flex ">
              <div className="flex-2 text-center w-[25%]"></div>
              <div className="self-end text-end w-[25%] pr-1">Increase</div>
              <div className="self-end text-end w-[25%] pr-1">Decrease</div>
              <div className="flex-2 text-end w-[25%] pr-1">Variance</div>
            </div>
            <div></div>
            <div>Total</div>
            <div></div>
            <div></div>
            <div></div>
            <div className="flex">
              <div className="flex-1"></div>
              <div className="flex justify-end flex-1 ">
                <input
                  readOnly={true}
                  value={inc}
                  disabled={true}
                  className="border-0 text-neutral-800 font-semibold flex-1 pr-1 w-full text-end focus:outline-none focus:ring-0 focus:ring-offset-0"
                ></input>
              </div>
              <div className="justify-end flex-1 ">
                <input
                  readOnly={true}
                  disabled={true}
                  value={dec}
                  className="border-0 text-neutral-800 font-semibold flex-1 pr-1 w-full text-end focus:outline-none focus:ring-0 focus:ring-offset-0"
                ></input>
              </div>
              <div className="flex-1">
                <input
                  readOnly={true}
                  disabled={true}
                  value={formatNumber(+(inc ?? 0) - +(dec ?? 0))}
                  className={`text-blue-500 border-0 font-semibold flex-1 w-[98%] px-1 pr-1 text-end focus:outline-none focus:ring-0 focus:ring-offset-0`}
                ></input>
              </div>
            </div>
            <div></div>
          </div>
        )}

        {lines.length > 0 && (
          <div>
            <div className="grid grid-cols-[.8fr_.5fr_.4fr_1.15fr_2fr_.3fr] gap-2 px-3 py-4 border border-transparent font-semibold text-neutral-600">
              <div className="self-end">Initiative</div>
              <div className="self-end">Grant</div>
              <div className="self-end">Category</div>
              <div className="self-end">Account</div>
              <div className="flex justify-between ">
                <div className="text-center flex-2">Current Balance</div>
                <div className="self-end  text-end flex-[1.5] pr-2">
                  Increase
                </div>
                <div className="self-end text-end flex-[1.5] pr-2">
                  Decrease
                </div>
                <div className="text-center flex-2 self-end">New Balance</div>
                <div className="text-center flex-2 ">Remaining Balance</div>
              </div>
              <div></div>
            </div>
          </div>
        )}
        <div className="pb-100">
          {lines.map((item, index) => {
            const balances = savedBalances.filter(
              (b) =>
                b.key.initiativeId === item.initiativeId &&
                b.key.grantId == item.grantId &&
                b.key.categoryId == item.categoryId,
            )[0].balances;

            // console.log('balances2', balances);

            return (
              <div
                key={index}
                className="grid grid-cols-[.8fr_.5fr_.4fr_1.15fr_2fr_.3fr] gap-2 px-3 py-2 border border-neutral-300 items-center mb-3 "
              >
                <TransactionRow
                  key={item.uuid}
                  lineItem={item}
                  balances={balances}
                  accountChange={handleAccountChange}
                  duplicateRow={handleDuplicateRow}
                  deleteRow={handleDeletRow}
                  editRow={handleEditRow}
                  saveComment={handleSaveComment}
                  render={() => (
                    <div className="flex gap-0">
                      <div className="text-center flex-2 text-neutral-600 self-center w-full">
                        {reproHeader.status !== POSTED &&
                          formatCurrency(item.currentAmount)}
                      </div>
                      <NumericArrayInputGeneric
                        index={index}
                        setValue={setValue}
                        getValues={getValues}
                        register={register(`rows.${index}.increase`)}
                        fieldName="increase"
                        readOnly={reproHeader.status === POSTED}
                        disabled={reproHeader.status === POSTED}
                        onBlur={recalculateNewAmounts}
                        classes={`flex-[1.5] w-full pl-1 mr-1 pr-1 py-1 text-end border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0
                       ${reproHeader.status === POSTED ? 'border-b-0' : 'border-b-2 '}
                       ${reproHeader.status === POSTED && +item.increase! === 0 ? '  opacity-0  ' : '  '}`}
                      />
                      <NumericArrayInputGeneric
                        index={index}
                        register={register(`rows.${index}.decrease`)}
                        fieldName="decrease"
                        setValue={setValue}
                        getValues={getValues}
                        readOnly={reproHeader.status === POSTED}
                        disabled={reproHeader.status === POSTED}
                        onBlur={recalculateNewAmounts}
                        classes={`flex-[1.5] w-full pl-1 mr-1 pr-1 py-1 text-end  border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0
                       ${reproHeader.status === POSTED ? 'border-b-0' : 'border-b-2 '}
                       ${reproHeader.status === POSTED && +item.decrease! === 0 ? '  opacity-0  ' : '  '}`}
                      />
                      <div
                        className={`text-center flex-2 self-center text-neutral-600  ${item.newAmount < 0 ? 'text-red-500' : ''}`}
                      >
                        {reproHeader.status !== POSTED &&
                          formatCurrency(item.newAmount)}
                      </div>
                      <div
                        className={`flex justify-center flex-2 self-center  `}
                      >
                        <div
                          className={`  ${(item.newRemainingAmount ?? 0) < 0 ? 'text-red-500' : 'text-green-500'}`}
                        >
                          {formatCurrency(item.newRemainingAmount ?? 0)}
                        </div>
                      </div>
                    </div>
                  )}
                  canEdit={reproHeader.status !== POSTED}
                ></TransactionRow>
              </div>
            );
          })}
        </div>
        <AddLineModal
          year={repro.year}
          isOpen={addLineModalIsOpen}
          onLineAdded={handleLineAdded}
          onCancel={() => {
            setTimeout(() => {
              setAddLineModalIsOpen(false);
            }, 500);
          }}
        ></AddLineModal>
        {editSelections && (
          <EditLineModal
            year={repro.year}
            uuid={editSelections.uuid}
            isOpen={editSelections !== null}
            selections={editSelections}
            onLineUpdated={handleLineUpdated}
            onCancel={() => {
              setTimeout(() => {
                setEditSelections(null);
              }, 500);
            }}
          ></EditLineModal>
        )}
        <JustificaModal
          canEdit={reproHeader.status !== POSTED}
          isOpen={justModalIsOpen}
          onCommentSaved={handleSaveJust}
          itemComment={reproHeader.justification}
          onCancel={() => {
            setTimeout(() => {
              setJustModalIsOpen(false);
            }, 500);
          }}
        ></JustificaModal>
        <ErrorsModal
          isOpen={errorModalOpen}
          errors={getErrors()}
          onCancel={() => {
            setTimeout(() => {
              setErrorModalOpen(false);
            }, 500);
          }}
        ></ErrorsModal>
        <ConfirmModal
          isOpen={confirmPostModalIsOpen}
          onConfirm={() => {
            setTimeout(() => {
              setConfirmPostModal(false);
              onConfirmPost();
            }, 500);
          }}
          onCancel={() => {
            setTimeout(() => {
              setConfirmPostModal(false);
            }, 500);
          }}
          message="This reprogramming wil be posted. Click OK to continue."
        ></ConfirmModal>
      </div>
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

function hasNegativeRemainingBalances(lines: ReproLineItem[]): boolean {
  const lines2 = lines
    .map((l) => ({
      rem: l.remainingAmount,
      inc: +(l.increase ?? 0),
      dec: +(l.decrease ?? 0),
    }))
    .map((l) => l.rem + l.inc - l.dec);

  return lines2.some((x) => x < 0);
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

export default ReproForm;
