import { useState } from 'react';
import { formatDate } from '../../app/util';
import { Ellipsis } from 'lucide-react';
import InvoiceInfoModal from './modals/InvoiceInfoModal';

type Props = { paymentLineItem: PaymentLineItem; onUpdatePayment: () => void };

const InvoiceEditor = ({ paymentLineItem }: Props) => {
  const [invoiceModalIsopen, setInvoiceModalIsOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-1 bg-neutral-300/40 rounded-sm p-2 px-3">
        <div className="flex ">
          <div className="flex-1  text-neutral-500 ">Invoice No.</div>
          <div
            className="flex-1 flex justify-end text-neutral-950"
            onClick={() => setInvoiceModalIsOpen(true)}
          >
            {paymentLineItem.invoiceNumber && (
              <div>{paymentLineItem.invoiceNumber}</div>
            )}
            {!paymentLineItem.invoiceNumber && (
              <span className="text-neutral-500 hover:underline cursor-pointer underline-offset-2 hover:text-blue-700 transition-all duratiokn-200">
                <Ellipsis></Ellipsis>
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="flex-1  text-neutral-500">Invoice Date</div>
          <div
            className="flex-1  flex justify-end  text-neutral-950"
            onClick={() => setInvoiceModalIsOpen(true)}
          >
            {paymentLineItem.invoiceDate && (
              <div>{formatDate(paymentLineItem.invoiceDate)}</div>
            )}
            {!paymentLineItem.invoiceDate && (
              <span className="text-neutral-500 hover:underline cursor-pointer underline-offset-2 hover:text-blue-500 transition-all duratiokn-200">
                <Ellipsis></Ellipsis>
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="flex-1  text-neutral-500">Check No.</div>
          <div
            className="flex-1  flex justify-end  text-neutral-950"
            onClick={() => setInvoiceModalIsOpen(true)}
          >
            {paymentLineItem.checkNumber}
            {!paymentLineItem.checkNumber && (
              <span className="text-neutral-500 hover:underline cursor-pointer underline-offset-2 hover:text-blue-500 transition-all duratiokn-200">
                <Ellipsis></Ellipsis>
              </span>
            )}
          </div>
        </div>
      </div>

      <InvoiceInfoModal
        isOpen={invoiceModalIsopen}
        paymentLineItem={paymentLineItem}
        onCancel={() => {
          setTimeout(() => {
            setInvoiceModalIsOpen(false);
          }, 500);
        }}
      ></InvoiceInfoModal>
    </div>
  );
};
export default InvoiceEditor;
