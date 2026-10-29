import { useState } from 'react';
import { formatDate } from '../../app/util';

type Props = { p: PaymentLineItem };

const InvoiceEditor = ({ p }: Props) => {
  const [invoiceModalIsopen, setInvoiceModalIsOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-1 bg-neutral-300/40 rounded-sm p-2 px-3">
        <div className="flex ">
          <div className="flex-1  text-neutral-500 ">Invoice No.</div>
          <div className="flex-1  text-end  text-neutral-950">
            {p.invoiceNumber || (
              <span className="text-blue-500 hover:underline cursor-pointer underline-offset-2 hover:text-blue-700 transition-all duratiokn-200">
                Update
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="flex-1  text-neutral-500">Invoice Date</div>
          <div className="flex-1  text-end text-neutral-950">
            {p.invoiceDate ? formatDate(p.invoiceDate) : <div></div>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceEditor;
