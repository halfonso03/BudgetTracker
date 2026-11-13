import { v4 as uuidv4 } from 'uuid';
import { Ellipsis, TrashIcon } from 'lucide-react';
import { POSTED } from '../../app/constants';
import {
  formatCurrency,
  formatDate,
  parseFormattedNumber,
} from '../../app/util';
import InvoiceInfoModal from './modals/InvoiceInfoModal';
import { useState } from 'react';
import PaymentNumber from './PaymentNumber';
import Label from '../../components/Label';
type Props = {
  paymentLineItem: PaymentLineItem;
  paymentHeader: PaymentHeader;
  onEditRow: (uuid: string) => void;
  onDeleteRow: (p: PaymentLineItem) => void;
  onInvoiceUpdated: (data: {
    uuid: string;
    invoiceNumber: string | null;
    checkNumber: string | null;
    invoiceDate: Date | null;
  }) => void;
};

const PaymentPayee = ({
  paymentLineItem,
  paymentHeader,
  onDeleteRow,
  onEditRow,
  onInvoiceUpdated,
}: Props) => {
  const [invoiceModalIsopen, setInvoiceModalIsOpen] = useState(false);

  function onEditRowClick(uuid: string) {
    if (paymentHeader.status === POSTED) {
      setInvoiceModalIsOpen(true);
    } else {
      onEditRow(uuid);
    }
  }

  return (
    <div className="pb-2  bg-neutral-200/80 dark:bg-slate-800/80 dark:border dark:border-slate-700/80 p-2 rounded-md shadow-md">
      <div className="flex">
        <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-slate-900/80 dark:border dark:border-slate-700/80 dark:text-slate-800/80 p-2 rounded-md px-3">
          <div className="rounded-sm mb-6">
            <div className="flex mb-2">
              <div className="flex-1">
                <Label>Payee Name</Label>
              </div>
              <div className="flex-2 text-end  font-semibold dark:text-white">
                {paymentLineItem.payeeName}
              </div>
            </div>

            <div className="flex">
              <div className="flex-1  ">
                <Label>Payment Amount</Label>
              </div>
              <div className="flex-1 text-blue-500 font-mono dark:text-indigo-400 font-medium text-end  ">
                {formatCurrency(
                  parseFormattedNumber(
                    paymentLineItem.paymentAmount.toString(),
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex text-neutral-800">
              <div className="flex-1">
                <Label>Invoice Date</Label>
              </div>
              <div className="flex-1 flex justify-end  text-neutral-950 dark:text-white">
                {paymentLineItem.invoiceDate && (
                  <div>{formatDate(paymentLineItem.invoiceDate)}</div>
                )}
                {!paymentLineItem.invoiceDate && (
                  <div className="text-neutral-400/70 font-bold">-</div>
                )}
              </div>
            </div>
            <div className="flex text-neutral-800">
              <div className="flex-1 ">
                <Label>Invoice No.</Label>
              </div>
              <div>
                {paymentLineItem.invoiceNumber && (
                  <div className="dark:text-white">
                    {paymentLineItem.invoiceNumber}
                  </div>
                )}
                {!paymentLineItem.invoiceNumber && (
                  <div className="text-neutral-400/70 font-bold">-</div>
                )}
              </div>
            </div>

            <div className="flex text-neutral-800">
              <div className="flex-1 ">
                <Label>Check No.</Label>
              </div>
              <div>
                {paymentLineItem.checkNumber && (
                  <div className="dark:text-white">
                    {paymentLineItem.checkNumber}
                  </div>
                )}
                {!paymentLineItem.checkNumber && (
                  <div className="text-neutral-400/70 font-bold">-</div>
                )}
              </div>
            </div>
          </div>
          {/* {paymentLineItem.paymentLineItemId} */}
          <InvoiceInfoModal
            isOpen={invoiceModalIsopen}
            key={uuidv4()}
            paymentInvoiceInfo={{
              ...paymentLineItem,
              paymentId: paymentHeader.id,
            }}
            onCancel={() => {
              setTimeout(() => {
                setInvoiceModalIsOpen(false);
              }, 500);
            }}
            onInvoiceUpdated={onInvoiceUpdated}
          ></InvoiceInfoModal>
        </div>

        <div className="flex flex-col justify-between gap-1 flex-1 items-end ">
          <div className="w-[99%] rounded-sm p-2 ">
            <PaymentNumber
              paymentLineItem={paymentLineItem}
              status={paymentHeader.status}
            ></PaymentNumber>
            <div className="flex w-full ">
              <div className="flex-8 text-end text-[1rem]">
                <Label>Last Payment Date</Label>
              </div>
              <div className="flex-5 text-end text-neutral-800 dark:text-white ">
                {paymentLineItem.lastPaymentDate
                  ? formatDate(paymentLineItem.lastPaymentDate)
                  : '-'}
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <div className="flex gap-4 p-1 ">
              <Ellipsis
                size={22}
                className={`text-neutral-500 cursor-pointer  hover:text-blue-500 dark:hover:text-slate-100 duration-200 transition-all hover:scale-125 dark:text-slate-200`}
                onClick={() => onEditRowClick(paymentLineItem.uuid)}
              ></Ellipsis>
              {paymentHeader.status !== POSTED && (
                <TrashIcon
                  className="text-red-600 dark:text-rose-500 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
                  size={22}
                  onClick={() => onDeleteRow(paymentLineItem)}
                ></TrashIcon>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentPayee;
