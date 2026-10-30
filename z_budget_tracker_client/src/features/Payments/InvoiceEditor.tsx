import { useState } from 'react';
import InvoiceInfoModal from './modals/InvoiceInfoModal';

type Props = { paymentLineItem: PaymentLineItem; onUpdatePayment: () => void };

const InvoiceEditor = ({ paymentLineItem }: Props) => {
  const [invoiceModalIsopen, setInvoiceModalIsOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-1 bg-neutral-300/40 rounded-sm p-2 px-3"></div>

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
