import SortingProvider from '../../contexts/SortingContextProvider';
import PayeePaymentsList from './PayeePaymentsList';
import PayeePaymentsStats from './PayeePaymentsStats';

type Props = {
  payeeId: number;
};
const PayeePayments = ({ payeeId }: Props) => {
  return (
    <div>
      <div>
        <div className="font-semibold text-neutral-500  border-b border-b-neutral-300 pl-0 p-1 mb-9">
          Payments
        </div>
      </div>

      <PayeePaymentsStats payeeId={payeeId}></PayeePaymentsStats>
      <SortingProvider>
        <PayeePaymentsList payeeId={payeeId}></PayeePaymentsList>
      </SortingProvider>
    </div>
  );
};
export default PayeePayments;
