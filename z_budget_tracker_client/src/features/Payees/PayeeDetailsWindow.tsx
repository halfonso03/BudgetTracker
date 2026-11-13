import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import PayeeForm from './PayeeForm';
import NavBar from '../../components/NavBar';
import PayeePayments from './PayeePayments';

type Props = {
  onClose: () => void;
  payee: Payee;
};

const PayeeDetailsWindow = ({ payee, onClose }: Props) => {
  // const [showNewPaymentLink, setShowNewPaymentLInk] = useState(false);
  // const [newPayeeInfo, setNewPayeeInfo] = useState<NewPayeeInfo | null>(null);

  function handlePayeeCreated() {
    // setNewPayeeInfo(i);
  }

  return createPortal(
    <div className="fixed inset-0 z-5 h-auto w-full bg-white border-t border-t-neutral-300 dark:border-t-0 dark:bg-slate-900 ">
      <div className="relative ">
        <NavBar></NavBar>
        <div className="w-full flex justify-between pt-2 pr-4 mt-4 mb-4">
          <div className="font-bold text-xl text-neutral-800 pl-7">
            {payee.id === 0 ? (
              <div className="text-white">Add Payee</div>
            ) : (
              <div className="text-white">Edit Payee</div>
            )}
          </div>

          <X
            className=" absolute right-2 top-19 text-neutral-500 m-0 p-0 cursor-pointer hover:text-neutral-800 dark:text-slate-300 dark:hover:text-slate-200"
            size={36}
            onClick={onClose}
          ></X>
        </div>
        <div className="w-[97%] mx-auto">
          <div className="flex gap-12 w-full">
            <div className="flex-5">
              <PayeeForm
                payee={payee}
                onCreatePayeeCreated={handlePayeeCreated}
              ></PayeeForm>
            </div>

            <div className="flex-11">
              {payee.id !== 0 && (
                <PayeePayments payeeId={payee.id}></PayeePayments>
              )}

              {/* {showNewPaymentLink && (
                <Link
                  className="text-blue-500"
                  to={`/payees/payment/new?payeeid=${newPayeeInfo?.id}&accountId=${newPayeeInfo?.accountId}&categoryId=${newPayeeInfo?.categoryId}`}
                >
                  <div className="flex gap-1 items-center">
                    Create new payment <ArrowRight></ArrowRight>
                  </div>
                </Link>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
export default PayeeDetailsWindow;
