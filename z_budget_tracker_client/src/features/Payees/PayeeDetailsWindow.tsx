import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import PayeeDetailsForm from './PayeeDetailsForm';
import PaymentsList from './PaymentsList';

type Props = {
  onClose: () => void;
  payee: Payee;
};

const PayeeDetailsWindow = ({ payee, onClose }: Props) => {
  return createPortal(
    <div className="w-full min-h-10/11 absolute top-17 z-1000 bg-neutral-50 border-t border-t-neutral-300 ">
      <div className="relative p-4">
        <div className="w-full flex justify-end">
          <X
            className="text-neutral-500 cursor-pointer hover:text-neutral-800"
            size={36}
            onClick={onClose}
          ></X>
        </div>
        <div className="w-[80%] mx-auto ">
          <div className="flex gap-14 w-full">
            <div className="flex-5">
              <PayeeDetailsForm payee={payee}></PayeeDetailsForm>
            </div>
            <div className="flex-7">
              <PaymentsList payeeId={payee.id}></PaymentsList>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
export default PayeeDetailsWindow;
