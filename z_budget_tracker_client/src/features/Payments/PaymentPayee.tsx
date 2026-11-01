import { AlertTriangle, Ellipsis, TrashIcon } from 'lucide-react';
import { POSTED } from '../../app/constants';
import {
  formatCurrency,
  formatDate,
  parseFormattedNumber,
} from '../../app/util';
import InvoiceInfoModal from './modals/InvoiceInfoModal';
import { useState } from 'react';
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
    <div className="border-b border-b-neutral-200 pb-2 last:border-0 bg-neutral-200/80 p-2 rounded-sm shadow-md">
      <div className="flex">
        <div className="flex flex-col flex-1 bg-neutral-50 p-2 rounded-sm px-3">
          <div className="rounded-sm mb-6">
            <div className="flex mb-2">
              <div className="flex-1  text-neutral-500">Payee Name</div>
              <div className="flex-2 text-end  font-semibold">
                {paymentLineItem.payeeName}
              </div>
            </div>

            <div className="flex">
              <div className="flex-1  text-neutral-500">Payment Amount</div>
              <div className="flex-1 text-blue-500 font-medium text-end ">
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
              <div className="flex-1  text-neutral-500 ">Invoice No.</div>
              <div>
                {paymentLineItem.invoiceNumber && (
                  <div>{paymentLineItem.invoiceNumber}</div>
                )}
                {!paymentLineItem.invoiceNumber && (
                  <div>
                    <AlertTriangle className="text-yellow-400"></AlertTriangle>
                  </div>
                )}
              </div>
            </div>
            <div className="flex text-neutral-800">
              <div className="flex-1  text-neutral-500">Invoice Date</div>
              <div className="flex-1  flex justify-end  text-neutral-950">
                {paymentLineItem.invoiceDate && (
                  <div>{formatDate(paymentLineItem.invoiceDate)}</div>
                )}
                {!paymentLineItem.invoiceDate && (
                  <div>
                    <AlertTriangle className="text-yellow-400"></AlertTriangle>
                  </div>
                )}
              </div>
            </div>
            <div className="flex text-neutral-800">
              <div className="flex-1 text-neutral-500">Check No.</div>
              <div>
                {paymentLineItem.checkNumber && (
                  <div>{paymentLineItem.checkNumber}</div>
                )}
                {!paymentLineItem.checkNumber && (
                  <div>
                    <AlertTriangle className="text-yellow-400"></AlertTriangle>
                  </div>
                )}
              </div>
            </div>
          </div>

          <InvoiceInfoModal
            isOpen={invoiceModalIsopen}
            key={crypto.randomUUID()}
            paymentLineItem={paymentLineItem}
            onCancel={() => {
              setTimeout(() => {
                setInvoiceModalIsOpen(false);
              }, 500);
            }}
            onInvoiceUpdated={onInvoiceUpdated}
          ></InvoiceInfoModal>
        </div>

        <div className="flex flex-col justify-between gap-1 flex-1 items-end ">
          <div className="w-[99%]  rounded-sm p-2 ">
            <div className="flex w-full  ">
              <div className="flex-8 text-end  text-neutral-500 text-[1rem]">
                Payment No.
              </div>
              <div className="flex-5 text-end text-neutral-800">
                {(paymentLineItem.numberOfPayments ?? 0) + 1}
              </div>
            </div>
            <div className="flex w-full ">
              <div className="flex-8 text-end  text-neutral-500 text-[1rem]">
                Last Payment Date
              </div>
              <div className="flex-5 text-end text-neutral-800 ">
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
                className={`text-neutral-500 cursor-pointer  hover:text-blue-500 duration-200 transition-all hover:scale-125`}
                onClick={() => onEditRowClick(paymentLineItem.uuid)}
              ></Ellipsis>
              {paymentHeader.status !== POSTED && (
                <TrashIcon
                  className="text-red-600 opacity-60 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
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
