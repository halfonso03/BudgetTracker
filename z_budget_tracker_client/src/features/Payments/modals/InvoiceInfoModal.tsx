import { useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  paymentLineItem: PaymentLineItem;
};

const InvoiceInfoModal = ({ paymentLineItem, ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  function closeModal() {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  }

  return (
    <Modal2
      size="lg"
      title="Update Invoice Information"
      animateOut={animateOut}
      {...props}
    >
      <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">
        <pre>{JSON.stringify(paymentLineItem)}</pre>
      </div>
      <div className="flex justify-end gap-3 pb-3">
        <Button variation="secondary" onClick={closeModal}>
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default InvoiceInfoModal;
