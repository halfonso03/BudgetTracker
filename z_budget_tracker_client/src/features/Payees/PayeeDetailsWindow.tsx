import { ArrowRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import PayeeForm from './PayeeForm';
import PaymentsList from './PaymentsList';
import NavBar from '../../components/NavBar';
import SortingProvider from '../../contexts/SortingContextProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  onClose: () => void;
  payee: Payee;
};

const PayeeDetailsWindow = ({ payee, onClose }: Props) => {
  const [showNewPaymentLink, setShowNewPaymentLInk] = useState(false);
  const [newPayeeInfo, setNewPayeeInfo] = useState<NewPayeeInfo | null>(null);

  function handlePayeeCreated(i: NewPayeeInfo) {
    setShowNewPaymentLInk(true);
    setNewPayeeInfo(i);
  }
  return createPortal(
    <div className="fixed inset-0 z-5 h-auto w-full  bg-neutral-50 border-t border-t-neutral-300 ">
      <div className="relative ">
        <NavBar></NavBar>
        <div className="w-full flex justify-between pt-2 pr-4 mt-4 mb-4">
          <div className="font-bold text-xl text-neutral-800 pl-17">
            {payee.id === 0 ? (
              <div className="">Add Payee</div>
            ) : (
              <div>Edit Payee</div>
            )}
          </div>

          <X
            className=" absolute right-2 top-19 text-neutral-500 m-0 p-0 cursor-pointer hover:text-neutral-800"
            size={36}
            onClick={onClose}
          ></X>
        </div>
        <div className="w-[93%] mx-auto">
          <div className="flex gap-14 w-full">
            <div className="flex-5">
              <PayeeForm
                payee={payee}
                onCreatePayeeCreated={handlePayeeCreated}
              ></PayeeForm>
            </div>

            <div className="flex-8">
              {payee.id !== 0 && newPayeeInfo === null && (
                <SortingProvider>
                  <PaymentsList payeeId={payee.id}></PaymentsList>
                </SortingProvider>
              )}
              {showNewPaymentLink && (
                <Link
                  className="text-blue-500"
                  to={`/payees/payment/new?payeeid=${newPayeeInfo?.id}&accountId=${newPayeeInfo?.accountId}&categoryId=${newPayeeInfo?.categoryId}`}
                >
                  <div className='flex gap-1 items-center'>
                    Create new payment <ArrowRight></ArrowRight>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
export default PayeeDetailsWindow;
