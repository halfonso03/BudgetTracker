import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import PayeeDetailsForm from './PayeeDetailsForm';
import PaymentsList from './PaymentsList';
import NavBar from '../../components/NavBar';
import SortingProvider from '../../contexts/SortingContextProvider';

type Props = {
  onClose: () => void;
  payee: Payee;
};

const PayeeDetailsWindow = ({ payee, onClose }: Props) => {
  return createPortal(
    <div className="fixed inset-0 z-10000 h-auto w-full  bg-neutral-50 border-t border-t-neutral-300 ">
      <div className="relative ">
        <NavBar></NavBar>
        <div className="w-full flex justify-end pt-2 pr-2">
          <X
            className="text-neutral-500 m-0 p-0 cursor-pointer hover:text-neutral-800"
            size={36}
            onClick={onClose}
          ></X>
        </div>
        <div className="w-[93%] mx-auto">
          <div className="flex gap-14 w-full">
            <div className="flex-5">
              <PayeeDetailsForm payee={payee}></PayeeDetailsForm>
            </div>
            <div className="flex-8">
              <SortingProvider>
                <PaymentsList payeeId={payee.id}></PaymentsList>
              </SortingProvider>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
export default PayeeDetailsWindow;
