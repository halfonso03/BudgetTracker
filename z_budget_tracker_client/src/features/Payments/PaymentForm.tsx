import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BUDGET_CUMULATIVE_TOTAL_EXCEEDED,
  DUP_LINES,
  EDITED,
  NEGATIVE_NEW_AVAILABLE_BALANCE,
  NO_AMOUNT_LINES,
  NO_JUSTIFICATION,
  POSTED,
  SAVED,
} from '../../app/constants';
import { useForm } from 'react-hook-form';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import MenuIdProvider from '../../contexts/MenuIdContext';
import {
  AlertCircle,
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  TrashIcon,
} from 'lucide-react';
import Button from '../../components/Button';
import useClientAuth from '../../contexts/useAuth';
import JustificaModal from '../Common/modals/JustificaModal';
import ErrorsModal from '../Common/modals/ErrorsModal';
import PaymentLineModal from './modals/PaymentLineModal';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePaymentMutations } from '../../api/hooks/payments/usePaymentMutations';
import ConfirmModal from '../../components/ConfirmModal';
import IdHeader from '../Common/IdHeader';
import { useLocation } from 'react-router-dom';

type DeletePayeeInfo = {
  isOpen: boolean;
  payeeName?: string;
  paymentAmount?: string;
  rowUuid?: string;
};

interface Props {
  payment: Payment;
  onSaved?: () => void;
  onInitialSave?: (newId: number) => void;
  onIsDirty: (dirty: boolean) => void;
  preloadedValues?: PaymentPreloadedValues | null;
}

const PaymentForm = ({
  payment,
  onSaved,
  onInitialSave,
  onIsDirty,
  preloadedValues,
}: Props) => {
  let initialEditSelection: PaymentLineItemSelections | null = null;

  const { user, loginId } = useClientAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const created = location.state?.created ? true : false;
  const [justModalIsOpen, setJustModalIsOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [deleteRowConfirm, setDeleteRowConfirm] = useState<DeletePayeeInfo>({
    isOpen: false,
  });

  const [confirmPostModalIsOpen, setConfirmPostModal] =
    useState<boolean>(false);

  if (preloadedValues !== null && preloadedValues !== undefined) {
    // console.log('preloadedValues', preloadedValues);
    // console.log('initialSelection', initialEditSelection);
    initialEditSelection = { ...preloadedValues, uuid: crypto.randomUUID() };
  }

  const [editSelections, setEditSelections] =
    useState<PaymentLineItemSelections | null>(initialEditSelection);

  if (payment.year === 0) throw new Error('no year');

  //payment.justification
  const [paymentHeader, setPaymentHeader] = useState<PaymentHeader>({
    id: payment.id,
    justification: 'test',
    status: payment.posted ? POSTED : SAVED,
    createdById: payment.createdById,
    createDate: payment.createDate,
    postedDate: payment.postedDate,
    postedBy: payment.postedBy,
  });

  // const [savedRowBalances, setSavedRowBalances] = useState<PaymentRowBalance[]>(
  //   payment && payment.rowBalances ? payment.rowBalances! : [],
  // );

  const [lines, setLines] = useState<PaymentLineItem[]>(
    payment.lineItems.map((l) => {
      const line: PaymentLineItem = {
        ...l,
        paymentAmount: +parseFormattedNumber(l.paymentAmount.toString()),
        availableAmount: l.availableAmount,
        newAvailableAmount: l.availableAmount - +(l.paymentAmount ?? 0),
      };
      return line;
    }),
  );

  const [paymentLineModalIsOpen, setPaymentLineModalIsOpen] = useState(
    initialEditSelection !== null || payment.lineItems.length === 0,
  );

  const { setValue, getValues } = useForm<PaymentInputRows>({
    values: {
      rows: lines.map((l) => {
        return {
          ...l,
          paymentAmount: formatNumber(+(l?.paymentAmount ?? 0.0)),
          newAvailableAmount: +(l?.availableAmount ?? 0) - +l.paymentAmount,
        };
      }),
    },
  });

  const getPaymentTotal = useCallback(() => {
    const paymentTotal = lines
      .map((l) => l.paymentAmount ?? 0)
      .reduce((acc, cum) => +acc! + +cum!, 0);

    return Number(paymentTotal).toFixed(2);
  }, [lines]);

  const distinctBudgets = useMemo(() => {
    const seen: string[] = [];
    return lines
      .map((item) => {
        const key = `${item.initiativeName}-${item.grantName}-${item.categoryName}-${item.accountName}`;
        if (seen.some((x) => x === key)) return null;
        const setItem: PaymentSummary = {
          initiativeId: item.initiativeId,
          grantId: item.grantId,
          categoryId: item.categoryId,
          accountId: item.accountId,
          initiativeName: item.initiativeName,
          grantName: item.grantName,
          categoryName: item.categoryName,
          accountName: item.accountName,
          available: lines.filter(
            (x) =>
              x.initiativeName == item.initiativeName &&
              x.grantName == item.grantName &&
              x.categoryName === item.categoryName &&
              x.accountName == item.accountName,
          )[0].availableAmount,
          totalPaid: lines
            .filter(
              (x) =>
                x.initiativeName == item.initiativeName &&
                x.grantName == item.grantName &&
                x.categoryName === item.categoryName &&
                x.accountName == item.accountName,
            )
            .map((x) => parseFormattedNumber(x.paymentAmount.toString()))
            .reduce((acc, cur) => acc + cur, 0),
        };
        seen.push(key);
        return setItem;
      })
      .filter((x) => x);
  }, [lines]) as PaymentSummary[];

  const distinctInitiatives = useMemo(() => {
    const seen: { initiativeName: string; availableAmount: number }[] = [];

    return lines
      .map((item) => {
        const key = item.initiativeName;
        const a = item.availableAmount;

        if (seen.some((x) => x.initiativeName === key)) return null;

        seen.push({ initiativeName: key, availableAmount: a });
        return key;
      })
      .filter((x) => x);
  }, [lines]);

  console.log('distinctInitiatives', distinctInitiatives);

  const getErrors = useCallback(() => {
    const errors: string[] = [];

    if (!noDupLines(lines)) {
      errors.push(DUP_LINES);
    }

    if (!noZeroOnlyLines(lines)) {
      errors.push(NO_AMOUNT_LINES);
    }

    if (!noNegativeBalances(lines)) {
      errors.push(NEGATIVE_NEW_AVAILABLE_BALANCE);
    }

    const x = distinctBudgets.filter(
      (x) => (x?.available ?? 0) - (x?.totalPaid ?? 0) < 0,
    );

    if (x.length > 0) {
      errors.push(BUDGET_CUMULATIVE_TOTAL_EXCEEDED);
      console.log('x', x);
    }

    // if (hasNegativeRemainingBalances(lines) && !overrideNeg) {
    //   errors.push(NEGATIVE_REMAINING_BALANCE);
    // }

    if (
      !paymentHeader.justification ||
      paymentHeader.justification.trim().length === 0
    ) {
      errors.push(NO_JUSTIFICATION);
    }

    return errors;
  }, [distinctBudgets, lines, paymentHeader.justification]);

  const { createPayment, updatePayment } = usePaymentMutations();

  useEffect(() => {
    const errors = getErrors();

    if (
      errors.length > 0 &&
      lines.length > 0 &&
      paymentHeader.status !== POSTED
    ) {
      toast.custom(
        <div className="animate-right-to-in mt-20 rounded-sm p-4 shadow-md w-70 font-semibold bg-red-500 text-neutral-50 flex gap-2">
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
        paymentHeader.status !== POSTED
      )
        toast.remove();
    };
  }, [getErrors, lines, paymentHeader.status]);

  function handleLineAdded(newLine: PaymentLineItem) {
    // setTimeout(() => setAddLineModalIsOpen(false), 500);
    setTimeout(() => setPaymentLineModalIsOpen(false), 500);
    setLines([
      ...lines,
      {
        ...newLine,
        rowId: lines.length,
        paymentAmount: newLine.paymentAmount,
      },
    ]);

    onIsDirty(true);
  }

  function handleLineUpdated(updatedLine: PaymentLineItem) {
    setTimeout(() => {
      setEditSelections(null);
    }, 500);

    let index = -1;

    const newLines = lines.map((lineItem: PaymentLineItem, i: number) => {
      if (lineItem.uuid !== updatedLine.uuid) return lineItem;
      const newLine: PaymentLineItem = {
        ...updatedLine,
        rowId: lineItem.rowId,
        availableAmount: updatedLine.availableAmount,
        paymentAmount: updatedLine.paymentAmount,
        newAvailableAmount:
          updatedLine.availableAmount -
          parseFormattedNumber(updatedLine.paymentAmount.toString()),
      };
      index = i;
      return newLine;
    });

    setValue(`rows.${index}.paymentAmount`, updatedLine.paymentAmount);
    setLines(newLines);
  }

  // function handleDuplicateRow(uuid: string) {
  //   const duplicatedLine: PaymentLineItem = {
  //     ...lines.filter((x) => x.uuid === uuid)[0],
  //     paymentAmount: 0,
  //     rowId: lines.length,
  //     uuid: crypto.randomUUID(),
  //   };

  //   setLines([...lines, duplicatedLine]);
  //   onIsDirty(true);
  // }

  function onAddRow() {
    setEditSelections(null);
    setPaymentLineModalIsOpen(true);
  }

  function onAddPaymentToBudget(
    initiativeId: number,
    grantId: number,
    cagtegoryId: number,
    accountId: number,
  ) {
    setEditSelections(null);
    setPaymentLineModalIsOpen(true);
    setEditSelections(() => ({
      uuid: '',
      initiativeId: initiativeId,
      grantId: grantId,
      categoryId: cagtegoryId,
      accountId: accountId,
    }));
  }

  function handleEditRow(uuid: string) {
    const lineToEdit = lines.filter((x) => x.uuid == uuid)[0];
    let index = -1;
    for (const row of lines) {
      index++;

      if (row.uuid === uuid) break;
    }

    setEditSelections({
      uuid: uuid,
      initiativeId: lineToEdit.initiativeId,
      grantId: lineToEdit.grantId,
      categoryId: lineToEdit.categoryId,
      accountId: lineToEdit.accountId,
      payeeId: lineToEdit.payeeId,
      amount: parseFormattedNumber(
        getValues(`rows.${index}.paymentAmount`).toString(),
      ),
      comment: lineToEdit.comment,
    });
    setPaymentLineModalIsOpen(true);
  }

  function handleDeleteRow(uuid: string) {
    setLines((prev) =>
      prev
        .filter((x) => x.uuid !== uuid)
        .map((l: PaymentLineItem, i: number) => ({ ...l, rowId: i })),
    );
    onIsDirty(true);
  }

  function handleSaveJust(text: string) {
    setPaymentHeader((prev) => ({
      ...prev,
      justification: text,
      status: EDITED,
    }));
    setTimeout(() => setJustModalIsOpen(false), 500);
    onIsDirty(true);
  }

  // function handleSaveComment(uuid: string, comment: string | null | undefined) {
  //   setLines((prev) =>
  //     prev.map((line) => ({
  //       ...line,
  //       comment: line.uuid === uuid ? (comment ?? '') : line.comment,
  //     })),
  //   );

  //   onIsDirty(true);
  // }

  // function paymentAmountOnBlur(uuid: string) {
  //   const newLines = lines.map((line: PaymentLineItem, index: number) => {
  //     if (uuid !== line.uuid) return line;

  //     const paymentAmount = parseFormattedNumber(
  //       getValues(`rows.${index}.paymentAmount`) as string,
  //     );

  //     const updatedLine: PaymentLineItem = {
  //       ...line,
  //       paymentAmount: formatNumber(paymentAmount),
  //       newAvailableAmount: line.availableAmount - paymentAmount,
  //     };

  //     return updatedLine;
  //   });

  //   setLines(newLines);
  //   onIsDirty(true);
  // }

  function canPost() {
    return lines.length > 0 && noDupLines(lines);
  }

  function canSave() {
    let result = lines.length > 0;

    result = result && noDupLines(lines);

    result = result && paymentHeader.status !== POSTED;

    result =
      result &&
      paymentHeader.justification !== null &&
      paymentHeader.justification.trim().length > 0;

    return result;
  }

  async function savePaymentButtonClick() {
    try {
      const lineItems = lines.map((l) => ({
        ...l,
        amount: parseFormattedNumber(l.paymentAmount?.toString() ?? '0.00'),
      }));

      if (paymentHeader.id === 0) {
        sendCreatePayment(lineItems);
      } else {
        sendUpdatePayment(lineItems);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async function sendCreatePayment(
    lineItems: PaymentLineItemRequest[],
    posted: boolean = false,
  ) {
    const lineItems2 = lineItems.map((l) => {
      return {
        ...l,
      };
    });
    const paymentToSave: CreatePaymentRequest = {
      createdById: +user!.id,
      posted: posted,
      justification: paymentHeader.justification,
      lineItems: lineItems2,
    };

    await createPayment.mutateAsync(paymentToSave, {
      onSuccess: async (id) => {
        const postedDate = new Date();
        const createDate = new Date();

        if (posted) {
          await invalidateBalances();
        }

        queryClient.setQueryData<Payment>(['payment', id], () => ({
          ...paymentToSave,
          id: id,
          year: payment.year,
          justification: paymentHeader.justification,
          createdBy: loginId!,
          createDate: createDate,
          posted: posted,
          postedDate: posted ? postedDate : null,
          postedBy: posted ? loginId! : null,
          postedById: posted ? +user!.id! : null,
          rowBalances: lines.map((l) => ({
            initiativeId: l.initiativeId,
            grantId: l.grantId,
            accountId: l.accountId,
            remainingAmount: l.availableAmount,
          })),
          lineItems: lines.map((l) => {
            return {
              ...l,
              comment: l.comment ?? '',
              availableAmount: l.availableAmount,
              paymentAmount: l.paymentAmount,
              newAvailableAmount: l.newAvailableAmount,
            };
          }),
        }));

        onServerCreateSuccess(
          posted,
          id,
          createDate,
          posted ? postedDate : null,
        );
        onInitialSave?.(id);
        onSaved?.();
      },
      onError: (error) => {
        console.log('error', error);
      },
    });
  }

  async function sendUpdatePayment(
    lineItems: PaymentLineItemRequest[],
    posted: boolean = false,
  ) {
    const lineItems2 = lineItems.map((l) => {
      return {
        ...l,
      };
    });

    const paymentToSave: UpdatePaymentRequest = {
      id: paymentHeader.id,
      updatedById: +user!.id!,
      posted: posted,
      justification: paymentHeader.justification,
      lineItems: lineItems2,
    };

    await updatePayment.mutateAsync(paymentToSave, {
      onSuccess: async () => {
        if (posted) {
          await invalidateBalances();
        }
        const postedDate = new Date();

        queryClient.setQueryData<Payment>(
          ['payment', paymentHeader.id],
          () => ({
            ...paymentToSave,
            id: paymentHeader.id,
            year: payment.year,
            justification: paymentHeader.justification,
            createdBy: loginId!,
            createDate: paymentHeader.createDate!,
            createdById: paymentHeader.createdById!,
            posted: posted,
            postedDate: posted ? postedDate : null,
            postedBy: posted ? loginId! : null,
            postedById: posted ? +user!.id! : null,
            rowBalances: lines.map((l) => ({
              initiativeId: l.initiativeId,
              grantId: l.grantId,
              accountId: l.accountId,
              remainingAmount: l.availableAmount,
            })),
            lineItems: lines.map((l) => {
              return {
                ...l,
                comment: l.comment ?? '',
                availableAmount: l.availableAmount,
                paymentAmount: l.paymentAmount,
                newAvailableAmount: l.newAvailableAmount,
              };
            }),
          }),
        );

        console.log('123', 123);
        onServerUpdateSuccess(posted, posted ? postedDate : null);
        onSaved?.();
      },
    });
  }

  async function onConfirmPost() {
    const lineItems: PaymentLineItemRequest[] = lines.map((l) => ({
      rowId: l.rowId,
      initiativeId: l.initiativeId,
      grantId: l.grantId,
      categoryId: l.categoryId,
      accountId: l.accountId,
      payeeId: l.payeeId,
      comment: l.comment,
      amount: parseFormattedNumber(l.paymentAmount?.toString() ?? '0.00'),
    }));

    if (paymentHeader.id === 0) {
      sendCreatePayment(lineItems, true);
    } else {
      sendUpdatePayment(lineItems, true);
    }
  }

  function onServerCreateSuccess(
    posted: boolean,
    newId: number,
    createDate: Date,
    postedDate: Date | null,
  ) {
    setTimeout(() => {
      setPaymentHeader((prev) => {
        return {
          ...prev,
          id: newId,
          createdById: +user!.id!,
          createdBy: loginId!,
          createDate: createDate,
          status: posted ? POSTED : SAVED,
          postedDate: postedDate,
          postedBy: posted ? loginId : '',
        };
      });
    }, 1500);

    toast.success(posted ? 'Payment Posted.' : 'Payment Saved.', {
      duration: 1500,
    });
  }

  function onServerUpdateSuccess(
    posted: boolean,
    postedDate: Date | null = null,
  ) {
    setPaymentHeader((prev) => {
      return {
        ...prev,
        status: posted ? POSTED : SAVED,
        postedDate: postedDate,
        postedBy: posted ? loginId : '',
      };
    });

    setTimeout(() => {
      toast.success(posted ? 'Payment Posted.' : 'Payment Saved.', {
        duration: 1500,
      });
    }, 1);
  }

  async function invalidateBalances() {
    const uniqueLines = lines
      .filter(
        (item, index, self) =>
          self.findIndex(
            (t) =>
              t.initiativeId === item.initiativeId &&
              t.grantId == item.grantId &&
              t.categoryId == item.categoryId,
          ) === index,
      )
      .map((l) => ({ i: l.initiativeId, g: l.grantId, c: l.categoryId }));
    for (const l of uniqueLines) {
      await queryClient.refetchQueries({
        queryKey: ['payment_account_balances', +l.i, +l.g, +l.c],
      });
    }
  }

  function closeLineModal() {
    setTimeout(() => {
      setPaymentLineModalIsOpen(false);
    }, 500);
  }

  function getOverBudgetClassName(
    payments: PaymentLineItem[],
    initiativeId: number,
    grantId: number,
    accountId: number,
  ) {
    const available =
      distinctBudgets.filter(
        (x) =>
          x.initiativeId === initiativeId &&
          x.grantId == grantId &&
          x.accountId === accountId,
      )[0].available ?? 0;

    const paymentTotal = +payments
      .map((x) => parseFormattedNumber(x.paymentAmount.toString()))
      .reduce((acc, cur) => acc + cur, 0);

    return paymentTotal > available;
  }

  return (
    <MenuIdProvider>
      {/* <pre>{JSON.stringify(distinctBudgets)}</pre> */}
      <div>
        <div className="flex mb-12 justify-between text-neutral-400 mr-3 mt-14 ">
          {/* opacity-0 cursor-none */}
          <div
            className={`flex gap-2 cursor-default ${paymentHeader.status !== +POSTED ? '' : ''}`}
          >
            {/* <pre className="w-[20%]">{JSON.stringify(editSelections)}</pre> */}
            {payment !== undefined && (
              <Button buttonSize="small" onClick={onAddRow}>
                <Plus></Plus>
                Add Line
              </Button>
            )}
            <Button
              buttonSize="small"
              disabled={!canSave() || !user}
              onClick={savePaymentButtonClick}
            >
              <Save className="mr-1"></Save>
              Save
            </Button>
            <Button
              buttonSize="small"
              disabled={
                !canPost() ||
                getErrors().length > 0 ||
                paymentHeader.status === Number(POSTED) ||
                !user
              }
              onClick={() => {
                setConfirmPostModal(true);
              }}
            >
              <BookOpenText className="mr-1"></BookOpenText>
              Post
            </Button>
          </div>

          <Button
            className="flex gap-1 cursor-pointer hover:text-neutral-600 "
            onClick={() => setJustModalIsOpen(true)}
          >
            {paymentHeader.status === Number(POSTED) ? (
              <div className="self-center">View Justification</div>
            ) : (
              <div className="self-center">Justification</div>
            )}
            {paymentHeader.justification?.trim() === '' ? (
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

        <div className="flex justify-between mb-16 border-b border-b-neutral-200 pb-2 ">
          <IdHeader
            id={paymentHeader.id}
            status={paymentHeader.status}
            created={created}
          ></IdHeader>

          {paymentHeader.status === POSTED && (
            <div className="flex gap-12 mr-4  ">
              <div className="flex gap-3 font-semibold">
                <div className=" text-neutral-500">POSTED ON</div>
                <div>
                  {paymentHeader.postedDate
                    ? formatDate(paymentHeader.postedDate)
                    : ''}
                </div>
              </div>
              <div className="flex gap-3 font-semibold">
                <div className=" text-neutral-500">POSTED BY</div>
                <div>{paymentHeader.postedBy}</div>
              </div>
            </div>
          )}
        </div>

        {paymentHeader.status !== POSTED && (
          <div className="flex gap-10 px-3 py-1 border-b border-neutral-200 mb-8 font-semibold text-neutral-500 mt-12">
            <div className="">Total</div>
            <div className="text-neutral-900">{getPaymentTotal()}</div>
            <div></div>
          </div>
        )}

        {lines.length > 0 && paymentHeader.status === POSTED && (
          <div className="flex px-3 py-1 border-b border-neutral-200 mb-16 text-neutral-500 font-semibold">
            <div className="flex-4">Total Payment</div>
            <div className="flex-3 items-center justify-center ">
              <input
                readOnly={true}
                value={getPaymentTotal()}
                disabled={true}
                className="border-0 text-neutral-800 font-semibold flex-1 pr-1 w-full text-center focus:outline-none focus:ring-0 focus:ring-offset-0"
              ></input>
            </div>
          </div>
        )}

        {distinctBudgets && (
          <div>
            <div>
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr]  ">
                <div className="font-semibold text-neutral-600/90 bg-neutral-100 py-2 pl-1">
                  Initiative
                </div>
                <div className="font-semibold text-neutral-600/90 bg-neutral-100 py-2 pl-1">
                  Grant
                </div>
                <div className="font-semibold text-neutral-600/90 bg-neutral-100 py-2 pl-1">
                  Category
                </div>
                <div className="font-semibold text-neutral-600/90 bg-neutral-100 py-2 pl-1">
                  Account
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Available
                </div>
              </div>
            </div>
            {distinctBudgets.map((i: PaymentSummary) => {
              const payments = lines.filter(
                (x) =>
                  x.initiativeId == i.initiativeId &&
                  x.grantId == i.grantId &&
                  x.accountId === i.accountId,
              );
              return (
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] mb-10  pt-1 border-t border-t-neutral-200 ">
                  <div className="p-1 font-semibold mb-4">
                    {i.initiativeName}
                  </div>
                  <div className="py-1">{i.grantName}</div>
                  <div className="py-1">{i.categoryName}</div>
                  <div className="py-1">{i.accountName}</div>
                  <div className="text-center font-semibold py-1">
                    {i.available && formatCurrency(i.available)}
                  </div>
                  <div className="col-span-5 flex justify-end  mt-3 ">
                    <div className="w-full">
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] ">
                        <div className="col-span-3">
                          <Button
                            variation="secondary"
                            buttonSize={'small'}
                            onClick={() =>
                              onAddPaymentToBudget(
                                i.initiativeId,
                                i.grantId,
                                i.categoryId,
                                i.accountId,
                              )
                            }
                          >
                            <Plus></Plus>Add Payee
                          </Button>
                        </div>
                        <div className="p-2 text-neutral-600/90 bg-neutral-100 font-semibold border-b-neutral-300/90 border-b">
                          Payments
                        </div>
                        <div className="p-2 text-center text-neutral-600/90 bg-neutral-100 font-semibold border-b-neutral-300/90 border-b"></div>
                      </div>
                      <div>
                        {payments.map((p, i) => {
                          return (
                            <div className="grid grid-cols-[3fr_2fr] py-[.15rem]">
                              <div></div>
                              <div
                                className={`py-2 flex ${i === payments.length - 1 ? '' : 'border-b border-b-neutral-300/50'}`}
                              >
                                <div className="flex-1 pl-2  ">
                                  {p.payeeName}
                                </div>
                                <div className="flex-1 text-center relative  ">
                                  {formatCurrency(+p.paymentAmount)}
                                  <div className="flex absolute right-0 top-0 ">
                                    <div className="flex gap-4 pr-2">
                                      
                                      <Pencil
                                        size={20}
                                        className={`cursor-pointer text-neutral-400 hover:text-blue-500 duration-200 transition-all hover:scale-125`}
                                        onClick={() => handleEditRow(p.uuid)}
                                      ></Pencil>
                                      <TrashIcon
                                        className="text-red-600 opacity-60 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
                                        size={20}
                                        onClick={() => {
                                          setDeleteRowConfirm((prev) => ({
                                            ...prev,
                                            isOpen: true,
                                            payeeName: p.payeeName,
                                            rowUuid: p.uuid,
                                            paymentAmount: formatCurrency(
                                              parseFormattedNumber(
                                                p.paymentAmount?.toString() ??
                                                  '0.00',
                                              ),
                                            ),
                                          }));
                                        }}
                                      ></TrashIcon>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] ">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div className="p-2 font-semibold text-neutral-600/90 bg-neutral-100 border-t-neutral-300/90 border-t">
                          Total
                        </div>
                        <div
                          className={`${getOverBudgetClassName(payments, i.initiativeId, i.grantId, i.accountId) && 'text-red-600/70'} flex justify-center gap-2 items-center  p-2 font-semibold text-center text-neutral-600 bg-neutral-100 border-t-neutral-300/90 border-t`}
                        >
                          {formatCurrency(
                            +payments
                              .map((x) =>
                                parseFormattedNumber(
                                  x.paymentAmount.toString(),
                                ),
                              )
                              .reduce((acc, cur) => acc + cur, 0),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {paymentLineModalIsOpen && (
          <PaymentLineModal
            year={payment.year}
            onLineAdded={handleLineAdded}
            onLineUpdated={handleLineUpdated}
            selections={editSelections}
            uuid={editSelections?.uuid || null}
            fromRedirect={initialEditSelection !== null}
            onCancel={closeLineModal}
          ></PaymentLineModal>
        )}
        <JustificaModal
          canEdit={paymentHeader.status !== POSTED}
          isOpen={justModalIsOpen}
          onCommentSaved={handleSaveJust}
          itemComment={paymentHeader.justification}
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
          message="This payment wil be posted. Click OK to continue."
        ></ConfirmModal>
        <ConfirmModal
          isOpen={deleteRowConfirm.isOpen}
          onConfirm={() => {
            setTimeout(() => {
              handleDeleteRow(deleteRowConfirm!.rowUuid!);
              setDeleteRowConfirm((prev) => ({
                ...prev,
                isOpen: false,
              }));
            }, 500);
          }}
          onCancel={() => {
            setTimeout(() => {
              setDeleteRowConfirm((prev) => ({
                ...prev,
                isOpen: false,
              }));
            }, 500);
          }}
          message={`Delete Payment to ${deleteRowConfirm.payeeName} for ${deleteRowConfirm.paymentAmount}?`}
        ></ConfirmModal>

        {distinctBudgets && lines && lines.length > 1000 && (
          <>
            <div className="font-semibold text-neutral-500 text-center text-[1.1rem] mb-1">
              Payment Totals Summary
            </div>

            <div className="border border-neutral-200/80 w-[80%] mx-auto mb-10 ">
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]    ">
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Initiative
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Grant
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Category
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Account
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Available
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Total to Pay
                </div>
                <div className="font-semibold text-neutral-600/90 text-center bg-neutral-100 py-2 pl-1">
                  Remaining
                </div>
              </div>

              {distinctBudgets.map((d, index) => (
                <div
                  className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-t border-t-neutral-200  border-b border-b-neutral-200 py-3 last:border-0 last:mb-0  "
                  key={index}
                >
                  <div className=" text-center text-neutral-800">
                    {d?.initiativeName}
                  </div>
                  <div className=" text-center text-neutral-800">
                    {d?.grantName}
                  </div>
                  <div className=" text-center text-neutral-800">
                    {d?.categoryName}
                  </div>
                  <div className=" text-center text-neutral-800">
                    {d?.accountName}
                  </div>
                  <div className=" text-center text-neutral-800">
                    {formatCurrency(d?.available ?? 0)}
                  </div>
                  <div className=" text-center font-semibold">
                    {formatCurrency(d?.totalPaid ?? 0)}
                  </div>
                  <div
                    className={`text-center  text-neutral-800 ${(d?.available ?? 0) - (d?.totalPaid ?? 0) < 0 && 'text-red-500 font-semibold'}`}
                  >
                    {formatCurrency((d?.available ?? 0) - (d?.totalPaid ?? 0))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MenuIdProvider>
  );
};

function noNegativeBalances(lines: PaymentLineItem[]): boolean {
  const lines2 = lines
    .map((l) => ({
      availableAmount: l.availableAmount,
      amount: +(l.paymentAmount ?? 0),
    }))
    .map((l) => l.availableAmount - l.amount);

  return !lines2.some((x) => x < 0);
}

function noZeroOnlyLines(lines: PaymentLineItem[]): boolean {
  const lines2 = lines.map((l) => ({
    amount: +(l.paymentAmount ?? 0),
  }));

  return !lines2.some((x) => x.amount === 0);
}

function noDupLines(lines: PaymentLineItem[]): boolean {
  const counts: { name: string; count: number }[] = [];

  lines.map((l) => {
    const entity =
      l.initiativeName +
      '--' +
      l.grantName +
      '--' +
      l.categoryName +
      '--' +
      l.accountId.toString() +
      '--' +
      l.payeeId.toString();
    if (counts.some((x) => x.name === entity)) {
      const currCount = counts.filter((x) => x.name === entity)[0];
      currCount.count += 1;
    } else {
      counts.push({ name: entity, count: 1 });
    }
  });
  return !counts.some((x) => x.count > 1);
}

export default PaymentForm;
