import { AlertCircle, Pencil, Plus, TrashIcon } from 'lucide-react';
import { POSTED } from '../../app/constants';
import {
  formatCurrency,
  formatDate,
  parseFormattedNumber,
} from '../../app/util';
import Button from '../../components/Button';
import InvoiceEditor from './InvoiceEditor';

type Props = {
  payments: PaymentLineItem[];
  paymentHeader: PaymentHeader;
  onEditRow: (uuid: string) => void;
  onDeleteRow: (p: PaymentLineItem) => void;
  onAddPaymentToBudget: (i: number, g: number, c: number, a: number) => void;
  i: PaymentSummary;
  isOverBudget: boolean;
};
const PaymentPayees = ({
  onEditRow,
  onDeleteRow,
  payments,
  paymentHeader,
  onAddPaymentToBudget,
  isOverBudget,
  i,
}: Props) => {
  return (
    <div className=" w-full grid grid-cols-[2fr_3fr_2fr] ">
      {isOverBudget && <AlertCircle></AlertCircle>}
      <div>
        {paymentHeader.status !== POSTED && (
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
        )}
      </div>

      <div className="flex flex-col gap-6 text-[1.04rem]">
        {payments.map((p, i) => (
          <div
            key={i}
            className="border-b border-b-neutral-200 pb-2 last:border-0 bg-neutral-200/80 p-2 rounded-sm  shadow-lg"
          >
            <div className="flex">
              <div className="flex flex-col gap-4 flex-1 bg-neutral-50 p-2 rounded-sm px-3">
                <div className="rounded-sm ">
                  <div className="flex mb-2">
                    <div className="flex-1  text-neutral-500">Payee Name</div>
                    <div className="flex-2  text-end  font-medium">
                      {p.payeeName}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-1  text-neutral-500">
                      Payment Amount
                    </div>
                    <div className="flex-1  text-end ">
                      {formatCurrency(
                        parseFormattedNumber(p.paymentAmount.toString()),
                      )}
                    </div>
                  </div>
                </div>

                <InvoiceEditor p={p}></InvoiceEditor>
              </div>

              <div className="flex flex-col justify-between gap-1 flex-1 items-end ">
                <div className="w-[75%]  rounded-sm p-2">
                  <div className="flex ">
                    <div className="flex-5 text-end  text-neutral-500 text-[1rem]">
                      Payment No.
                    </div>
                    <div className="flex-2 text-end text-neutral-800">
                      {(p.numberOfPayments ?? 0) + 1}
                    </div>
                  </div>
                  <div className="flex w-full ">
                    <div className="flex-5 text-end  text-neutral-500 text-[1rem]">
                      Last Payment Date
                    </div>
                    <div className="flex-2 text-end text-neutral-800 ">
                      {p.lastPaymentDate ? formatDate(p.lastPaymentDate) : '-'}
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  {paymentHeader.status !== POSTED && (
                    <div className="flex gap-4 p-1 ">
                      <Pencil
                        size={22}
                        className={`text-neutral-500 cursor-pointer  hover:text-blue-500 duration-200 transition-all hover:scale-125`}
                        onClick={() => onEditRow(p.uuid)}
                      ></Pencil>
                      <TrashIcon
                        className="text-red-600 opacity-60 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
                        size={22}
                        onClick={() => onDeleteRow(p)}
                      ></TrashIcon>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default PaymentPayees;

{
  /*
    <div className="grid grid-cols-[1fr_1fr] w-full ">
        <div className="p-2 text-neutral-600/90 bg-neutral-50 font-semibold -neutral-300/60   -r-0">
          Payments
        </div>
        <div className="p-2 text-center text-neutral-600/90 bg-neutral-50 font-semibold  -neutral-300/60   ">
          Amount
        </div>
        {payments.map((p, i) => (
          <Fragment key={i}>
            <div className="p-2  -l  -neutral-300/60 -b ">
              {p.payeeName}
            </div>
            <div className="p-2 text-center -l -r -neutral-300/60  -b relative">
              {formatCurrency(+p.paymentAmount)}

              {paymentHeader.status !== POSTED && (
                <div className="flex absolute right-0 top-0  py-2  ">
                  <div className="flex gap-4 pr-2 ">
                    <Pencil
                      size={20}
                      className={`text-neutral-400 cursor-pointer  hover:text-blue-500 duration-200 transition-all hover:scale-125`}
                      onClick={() => onEditRow(p.uuid)}
                    ></Pencil>
                    <TrashIcon
                      className="text-red-600 opacity-60 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
                      size={20}
                      onClick={() => onDeleteRow(p)}
                    ></TrashIcon>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        ))}

        <div className="p-2 font-semibold text-neutral-600/90 bg-neutral-50  -neutral-300/60   -r-0 -t-0">
          Total
        </div>
        <div
          className={`${isOverBudget && 'text-red-600/70'} flex justify-center gap-2 items-center p-2 pr-1 font-semibold text-center text-neutral-800 bg-neutral-50 -neutral-300/60   -t-0`}
        >
          {formatCurrency(
            +payments
              .map((x) => parseFormattedNumber(x.paymentAmount.toString()))
              .reduce((acc, cur) => acc + cur, 0),
          )}
        </div>
      </div>
  */
}
