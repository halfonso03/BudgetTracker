import { Ellipsis, TrashIcon } from 'lucide-react';
import { POSTED } from '../../app/constants';
import {
  formatCurrency,
  formatDate,
  parseFormattedNumber,
} from '../../app/util';
import InvoiceInfoModal from './modals/InvoiceInfoModal';
import { useState } from 'react';
type Props = {
  p: PaymentLineItem;
  paymentHeader: PaymentHeader;
  onEditRow: (uuid: string) => void;
  onDeleteRow: (p: PaymentLineItem) => void;
};

const PaymentPayee = ({ p, paymentHeader, onDeleteRow, onEditRow }: Props) => {
  const [invoiceModalIsopen, setInvoiceModalIsOpen] = useState(false);

  function onEditInvoice() {
    setInvoiceModalIsOpen(true);
  }
  return (
    <div className="border-b border-b-neutral-200 pb-2 last:border-0 bg-neutral-200/80 p-2 rounded-sm shadow-md">
      <div className="flex">
        <div className="flex flex-col flex-1 bg-neutral-50 p-2 rounded-sm px-3">
          <div className="rounded-sm mb-6">
            <div className="flex mb-2">
              <div className="flex-1  text-neutral-500">Payee Name</div>
              <div className="flex-2 text-end  font-semibold">
                {p.payeeName}
              </div>
            </div>

            <div className="flex">
              <div className="flex-1  text-neutral-500">Payment Amount</div>
              <div className="flex-1 text-blue-500 font-medium text-end ">
                {formatCurrency(
                  parseFormattedNumber(p.paymentAmount.toString()),
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Ellipsis
              size={22}
              className={`self-start text-neutral-500 cursor-pointer hover:text-blue-500 duration-200 transition-all hover:scale-125`}
              onClick={() => onEditInvoice()}
            ></Ellipsis>
            <div className="flex text-neutral-800">
              <div className="flex-1  text-neutral-500 ">Invoice No.</div>
              <div>
                {p.invoiceNumber && <div>{p.invoiceNumber}</div>}
                {!p.invoiceNumber && <div>-</div>}
              </div>
            </div>
            <div className="flex text-neutral-800">
              <div className="flex-1  text-neutral-500">Invoice Date</div>
              <div className="flex-1  flex justify-end  text-neutral-950">
                {p.invoiceDate && <div>{formatDate(p.invoiceDate)}</div>}
                {!p.invoiceDate && <div>-</div>}
              </div>
            </div>
            <div className="flex text-neutral-800">
              <div className="flex-1 text-neutral-500">Check No.</div>
              <div>
                {p.checkNumber && <div>{p.checkNumber}</div>}
                {!p.checkNumber && <div>-</div>}
              </div>
            </div>
          </div>

          <InvoiceInfoModal
            uuid={p.uuid}
            paymentLineId={p.rowId}
            payeeName={p.payeeName}
            amount={parseFormattedNumber(p.paymentAmount.toString())}
            isOpen={invoiceModalIsopen}
            payeeId={p.payeeId}
            paymentNumber={p.numberOfPayments ?? 0 + 1}
            invoiceNumber={p.invoiceNumber}
            invoiceDate={p.invoiceDate}
            checkNumber={p.checkNumber}
            onCancel={() => {
              setTimeout(() => {
                setInvoiceModalIsOpen(false);
              }, 500);
            }}
          ></InvoiceInfoModal>
        </div>
        {paymentHeader.status !== POSTED && (
          <div className="flex flex-col justify-between gap-1 flex-1 items-end ">
            <div className="w-[99%]  rounded-sm p-2 ">
              <div className="flex w-full  ">
                <div className="flex-8 text-end  text-neutral-500 text-[1rem]">
                  Payment No.
                </div>
                <div className="flex-5 text-end text-neutral-800">
                  {(p.numberOfPayments ?? 0) + 1}
                </div>
              </div>
              {/* {paymentHeader.status !== POSTED && ( */}
              <div className="flex w-full ">
                <div className="flex-8 text-end  text-neutral-500 text-[1rem]">
                  Last Payment Date
                </div>
                <div className="flex-5 text-end text-neutral-800 ">
                  {p.lastPaymentDate ? formatDate(p.lastPaymentDate) : '-'}
                </div>
              </div>
              {/* // )} */}
            </div>

            <div className="flex items-end">
              <div className="flex gap-4 p-1 ">
                <Ellipsis
                  size={22}
                  className={`text-neutral-500 cursor-pointer  hover:text-blue-500 duration-200 transition-all hover:scale-125`}
                  onClick={() => onEditRow(p.uuid)}
                ></Ellipsis>
                {paymentHeader.status !== POSTED && (
                  <TrashIcon
                    className="text-red-600 opacity-60 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
                    size={22}
                    onClick={() => onDeleteRow(p)}
                  ></TrashIcon>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PaymentPayee;
