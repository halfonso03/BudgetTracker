import { useCallback, useState } from 'react';
import {
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
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import MenuIdProvider from '../../contexts/MenuIdContext';
import {
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  Plus,
  Save,
} from 'lucide-react';
import Button from '../../components/Button';
import useClientAuth from '../../contexts/useAuth';
import PaymentRow from './PaymentRow';
import JustificaModal from '../Common/modals/JustificaModal';
import ErrorsModal from '../Common/modals/ErrorsModal';
import PaymentLineModal from './modals/PaymentLineModal';
import PaymentAmountNumericArrayInput from './PaymentAmountNumericArrayInput';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePaymentMutations } from '../../api/hooks/payments/usePaymentMutations';

interface Props {
  payment: Payment;
  onSaved?: () => void;
  onInitialSave?: (newId: number) => void;


  // onInitialSave?: (newId: number) => void;
  // onIsDirty: (dirty: boolean) => void;
  // onSaved?: () => void;
}

const PaymentForm = ({ payment, onSaved, onInitialSave }: Props) => {
  const { user, loginId } = useClientAuth();
  const queryClient = useQueryClient();

  const [paymentLineModalIsOpen, setPaymentLineModalIsOpen] = useState(false);

  // const [addLineModalIsOpen, setAddLineModalIsOpen] = useState(false);
  const [justModalIsOpen, setJustModalIsOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  // const [confirmPostModalIsOpen, setConfirmPostModal] =
  //   useState<boolean>(false);
  const [editSelections, setEditSelections] =
    useState<PaymentLineItemSelections | null>(null);

  if (payment.year === 0) throw new Error('no year');

  const [paymentHeader, setPaymentHeader] = useState<PaymentHeader>({
    id: payment.id,
    justification: payment.justification,
    status: payment.posted ? POSTED : SAVED,
    postedDate: payment.postedDate,
    postedBy: payment.postedBy,
  });

  const [lines, setLines] = useState<PaymentLineItem[]>(
    payment.lineItems.map((l) => {
      const line: PaymentLineItem = {
        ...l,
        availableAmount: l.availableAmount,
        newAvailableAmount: l.availableAmount - +(l.paymentAmount ?? 0),
      };
      return line;
    }),
  );

  const { setValue, register, getValues } = useForm<PaymentInputRows>({
    values: {
      rows: lines.map((l) => {
        return {
          ...l,
          amount: formatNumber(+(l?.paymentAmount ?? 0.0)),
          newAvailableAmount: +(l?.availableAmount ?? 0) - +l.paymentAmount,
        };
      }),
    },
  });

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
  }, [lines, paymentHeader.justification]);

    const { createPayment, updatePayment } = usePaymentMutations();
  

  function handleLineAdded(newLine: PaymentLineItem) {
    // setTimeout(() => setAddLineModalIsOpen(false), 500);
    setTimeout(() => setPaymentLineModalIsOpen(false), 500);

    setLines([
      ...lines,
      {
        ...newLine,
        paymentAmount: formatNumber(
          parseFormattedNumber(newLine.paymentAmount.toString()),
        ),
        rowId: lines.length,
      },
    ]);

    // onIsDirty(true);
  }

  function handleLineUpdated(updatedLine: PaymentLineItem) {
    setTimeout(() => {
      setEditSelections(null);
    }, 500);

    let index = -1;

    console.log('updatedLine.paymentAmount', updatedLine.paymentAmount);

    const newLines = lines.map((l: PaymentLineItem, i: number) => {
      if (l.uuid !== updatedLine.uuid) return l;

      const newLine: PaymentLineItem = {
        ...updatedLine,
        rowId: l.rowId,
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

  function handleDuplicateRow(uuid: string) {
    const duplicatedLine: PaymentLineItem = {
      ...lines.filter((x) => x.uuid === uuid)[0],
      paymentAmount: 0,
      rowId: lines.length,
      uuid: crypto.randomUUID(),
    };

    setLines([...lines, duplicatedLine]);
    // onIsDirty(true);
  }

  function onAddRow() {
    setEditSelections(null);
    setPaymentLineModalIsOpen(true);
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

  function handleDeletRow(uuid: string) {
    setLines((prev) =>
      prev
        .filter((x) => x.uuid !== uuid)
        .map((l: PaymentLineItem, i: number) => ({ ...l, rowId: i })),
    );
    // onIsDirty(true);
  }

  function handleSaveJust(text: string) {
    setPaymentHeader((prev) => ({
      ...prev,
      justification: text,
      status: EDITED,
    }));
    setTimeout(() => setJustModalIsOpen(false), 500);
    // onIsDirty(true);
  }

  function handleSaveComment(uuid: string, comment: string | null | undefined) {
    setLines((prev) =>
      prev.map((line) => ({
        ...line,
        comment: line.uuid === uuid ? (comment ?? '') : line.comment,
      })),
    );

    // onIsDirty(true);
  }

  function paymentAmountOnBlur(uuid: string) {
    const newLines = lines.map((line: PaymentLineItem, index: number) => {
      if (uuid !== line.uuid) return line;

      const paymentAmount = parseFormattedNumber(
        getValues(`rows.${index}.paymentAmount`) as string,
      );

      console.log(
        'paymentAmount - line.availableAmount',
        paymentAmount - line.availableAmount,
      );
      const updatedLine: PaymentLineItem = {
        ...line,
        paymentAmount: formatNumber(paymentAmount),
        newAvailableAmount: line.availableAmount - paymentAmount,
      };

      return updatedLine;
    });

    setLines(newLines);
    // onIsDirty(true);
  }

  function canPost() {
    return true;
  }

  function canSave() {
    return true;
  }

  async function savePaymentButtonClick() {
    try {
      const lineItems = lines.map((l) => ({
        ...l,
        paymentAmount: parseFormattedNumber(
          l.paymentAmount?.toString() ?? '0.00',
        ),
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
    const paymnentToSave: CreatePaymentRequest = {
      createdById: +user!.id,
      posted: posted,
      justification: paymentHeader.justification,
      lineItems: lineItems2,
    };

    await createPayment.mutateAsync(paymnentToSave, {
      onSuccess: async (id) => {
        const postedDate = new Date();
        const createDate = new Date();

        if (posted) {
          await invalidateBalances();
        }

        queryClient.setQueryData<Payment>(['payment', id], () => ({
          ...paymnentToSave,
          id: id,
          year: payment.year,
          justification: paymentHeader.justification,
          createdBy: loginId!,
          createDate: createDate,
          posted: posted,
          postedDate: posted ? postedDate : null,
          postedBy: posted ? loginId! : null,
          postedById: posted ? +user!.id! : null,
          lineItems: lines.map((l) => {
            return {
              ...l,
              comment: l.comment ?? '',
              availableAmount: 0,
              paymentAmount: l.paymentAmount,
              newAvailableAmount: l.newAvailableAmount              
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

    console.log('lineItems2', lineItems2);

    const reproToSave: UpdatePaymentRequest = {
      id: paymentHeader.id,
      updatedById: +user!.id!,
      posted: posted,
      justification: paymentHeader.justification,
      lineItems: lineItems2,
    };
    await updatePayment.mutateAsync(reproToSave, {
      onSuccess: async () => {
        if (posted) {
          await invalidateBalances();
        }
        // await queryClient.invalidateQueries({
        //   queryKey: ['repro_account_balances'],
        // });
        // queryClient.setQueryData<Repro>(
        //   ['repro', paymentHeader.id],
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

    toast.success(posted ? 'Payment Posted.' : 'Payment Saved.', {
      duration: 1500,
    });
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
        queryKey: ['repro_account_balances', +l.i, +l.g, +l.c],
      });
    }
  }

  return (
    <MenuIdProvider>
      <div>
        {/* <pre>{JSON.stringify(lines)}</pre> */}
        <div className="flex mb-12 justify-between text-neutral-400 mr-3 mt-14 ">
          <div
            className={`flex gap-2 cursor-default ${paymentHeader.status !== +POSTED ? '' : 'opacity-0 cursor-none'}`}
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
                // setConfirmPostModal(true)
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
        <div className="pb-10">
          {lines.map((item, index) => {
            return (
              <PaymentRow
                key={index}
                lineItem={item}
                canEdit={true}
                status={paymentHeader.status}
                deleteRow={handleDeletRow}
                duplicateRow={handleDuplicateRow}
                editRow={handleEditRow}
                saveComment={handleSaveComment}
                render={() => {
                  const alertClass =
                    item.availableAmount -
                      parseFormattedNumber(item.paymentAmount.toString()) <
                    0
                      ? 'text-red-500'
                      : '';
                  return (
                    <div className="flex-3 px-3 pr-6">
                      <div className="grid grid-cols-[1fr_1fr_1fr] justify-between gap-2 ">
                        <div
                          className={` font-semibold text-neutral-600 text-center self-end  p-1 ${paymentHeader.status === POSTED ? 'opacity-0' : ''}`}
                        >
                          Available
                        </div>
                        <div className="text-center font-semibold text-neutral-600    p-1 px-3">
                          Payment
                        </div>
                        <div className="text-center self-end font-semibold text-neutral-600    p-1 px-3">
                          Remaining
                        </div>
                        <div>
                          <div>
                            <input
                              readOnly={true}
                              tabIndex={-1}
                              className={
                                'w-full  p-2 text-center text-neutral-600 focus:outline-none focus:ring-0'
                              }
                              value={formatNumber(item.availableAmount)}
                            ></input>
                          </div>
                        </div>
                        <div>
                          <PaymentAmountNumericArrayInput
                            index={index}
                            setValue={setValue}
                            register={register(`rows.${index}.paymentAmount`)}
                            fieldName="paymentAmount"
                            readOnly={true}
                            disabled={true}
                            onBlur={() => {
                              paymentAmountOnBlur(item.uuid);
                            }}
                            classes={`flex-[1.5] w-full text-center border-neutral-200 text-neutral-900 font-medium focus:outline-none focus:ring-0 focus:ring-offset-0
                       `}
                          />
                        </div>
                        <div>
                          <input
                            readOnly={true}
                            tabIndex={-1}
                            className={` ${alertClass} w-full  p-2 text-neutral-600 text-center focus:outline-none focus:ring-0`}
                            value={formatCurrency(item.newAvailableAmount)}
                          ></input>
                        </div>
                      </div>
                    </div>
                  );
                }}
              ></PaymentRow>
            );
          })}
        </div>
        {paymentLineModalIsOpen && (
          <PaymentLineModal
            year={payment.year}
            onLineAdded={handleLineAdded}
            onLineUpdated={handleLineUpdated}
            selections={editSelections}
            uuid={editSelections?.uuid || null}
            onCancel={() => {
              setTimeout(() => {
                setPaymentLineModalIsOpen(false);
                // setAddLineModalIsOpen(false);
              }, 500);
            }}
          ></PaymentLineModal>
        )}

        {/* <AddLineModal
          year={payment.year}
          isOpen={addLineModalIsOpen}
          onLineAdded={handleLineAdded}
          selections={editSelections}
          onCancel={() => {
            setTimeout(() => {
              setAddLineModalIsOpen(false);
            }, 500);
          }}
        ></AddLineModal> */}
        {/* {editSelections && (
          <EditLineModal
            year={payment.year}
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
        )} */}
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

export default PaymentForm;
