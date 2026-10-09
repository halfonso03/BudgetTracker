import { useCallback, useState } from 'react';
import {
  DUP_LINES,
  NEGATIVE_NEW_AVAILABLE_BALANCE,
  NO_AMOUNT_LINES,
  NO_JUSTIFICATION,
  POSTED,
  SAVED,
} from '../../app/constants';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatNumber } from '../../app/util';
import MenuIdProvider from '../../contexts/MenuIdContext';
import {
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  Plus,
  Save,
} from 'lucide-react';
import Button from '../../components/Button';
import useAuth from '../../contexts/useAuth';
import AddLineModal from './modals/AddLineModal';
import PaymentRow from './PaymentRow';

interface Props {
  payment: Payment;
  // onInitialSave?: (newId: number) => void;
  // onIsDirty: (dirty: boolean) => void;
  // onSaved?: () => void;
}

const PaymentForm = ({ payment }: Props) => {
  const { user, loginId } = useAuth();

  const [addLineModalIsOpen, setAddLineModalIsOpen] = useState(false);
  const [confirmPostModalIsOpen, setConfirmPostModal] =
    useState<boolean>(false);
  const [justModalIsOpen, setJustModalIsOpen] = useState(false);

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

  const { register, getValues, setValue } = useForm<PaymentInputRows>({
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

  async function saveReproButtonClick() {}

  function getPaymentAmount(index: number) {
    return {
      paymentAmount: getValues(`rows.${index}.paymentAmount`),
    };
  }

  function handleLineAdded(
    newLine: PaymentLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) {
    setTimeout(() => setAddLineModalIsOpen(false), 500);

    console.log('handleLineAdded PaymentLineItem', newLine);

    const newLines: PaymentLineItem[] = lines.map(
      (l: PaymentLineItem, i: number) => {
        const { paymentAmount } = getPaymentAmount(i);
        const newLine: PaymentLineItem = {
          ...l,
          availableAmount: l.availableAmount,
          paymentAmount: paymentAmount,
          newAvailableAmount: +l.availableAmount - +paymentAmount,
        };
        return newLine;
      },
    );

    setLines([...newLines, { ...newLine, rowId: lines.length }]);

    // const balances = queryClient.getQueryData<
    //   {
    //     accountId: number;
    //     accountName: string;
    //     currentAmount: number;
    //     remainingAmount: number;
    //   }[]
    // >([
    //   'repro_account_balances',
    //   key.initiativeId,
    //   key.grantId,
    //   key.categoryId,
    // ]);

    // if (
    //   !savedRowBalances ||
    //   !savedRowBalances.some(
    //     (b) =>
    //       b.key.initiativeId == key.initiativeId &&
    //       b.key.grantId == key.grantId &&
    //       b.key.categoryId == key.categoryId,
    //   )
    // ) {
    //   setSavedRowBalances((prev) => {
    //     const newArray = [
    //       ...prev,
    //       {
    //         key: {
    //           ...key,
    //         },
    //         balances: balances!,
    //       },
    //     ];

    //     return newArray;
    //   });
    // }

    // onIsDirty(true);
  }

  function canPost() {
    return true;
  }

  function canSave() {
    return true;
  }

  return (
    <MenuIdProvider>
      <div>
        <pre>{JSON.stringify(lines)}</pre>
        <div className="flex mb-12 justify-between text-neutral-400 mr-3 mt-14 ">
          <div
            className={`flex gap-2 cursor-default ${paymentHeader.status !== +POSTED ? '' : 'opacity-0 cursor-none'}`}
          >
            {payment !== undefined && (
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
              disabled={!canSave() || !user}
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
                paymentHeader.status === Number(POSTED) ||
                !user
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
                render={() => {
                  return (
                    <div className="flex gap-0">
                      <div className="text-center flex-2 text-neutral-600 self-center w-full">
                        {paymentHeader.status !== POSTED &&
                          formatCurrency(item.availableAmount)}
                      </div>
                    </div>
                  );
                }}
              ></PaymentRow>
            );
          })}
        </div>
        <AddLineModal
          year={payment.year}
          isOpen={addLineModalIsOpen}
          onLineAdded={handleLineAdded}
          onCancel={() => {
            setTimeout(() => {
              setAddLineModalIsOpen(false);
            }, 500);
          }}
        ></AddLineModal>
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
