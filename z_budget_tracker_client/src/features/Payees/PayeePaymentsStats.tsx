import { formatCurrency, formatDate } from '../../app/util';
import Spinner from '../../components/Spinner';
import { usePayeesPaymentsStats } from '../../api/hooks/payees/usePayeesPaymentsStats';

type Props = {
  payeeId: number;
};

const PayeePaymentsStats = ({ payeeId }: Props) => {
  const { paymentStats, loadingPaymentStats } = usePayeesPaymentsStats(payeeId);

  return (
    <div>
      <div className="mb-9 gap-4 w-full ">
        {loadingPaymentStats && (
          <div className="mb-1">
            <Spinner></Spinner>
          </div>
        )}

        {paymentStats && paymentStats.lastPaymentDate && (
          <div className="border-b border-b-neutral-200 grid grid-cols-[1.3fr_.7fr_1fr_.7fr_.5fr_1fr_.5fr_1fr] gap-2">
            <div className="text-neutral-400 font-medium ">
              Last Payment Date
            </div>
            <div className="text-neutral-800 font-medium">
              {paymentStats.lastPaymentDate
                ? formatDate(paymentStats!.lastPaymentDate!)
                : '-'}
            </div>

            <div className="text-neutral-400 font-medium">Average</div>
            <div className="text-neutral-800 font-medium">
              {paymentStats.averagePayment
                ? formatCurrency(paymentStats!.averagePayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">Smallest</div>
            <div className=" text-neutral-800 font-medium">
              {paymentStats.lowestPayment
                ? formatCurrency(paymentStats!.lowestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">Largest</div>
            <div className="text-neutral-800 font-medium">
              {paymentStats.highestPayment
                ? formatCurrency(paymentStats!.highestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">
              Last Payment Amount
            </div>
            <div className="text-neutral-800 font-medium">
              {paymentStats.lastPaymentAmount
                ? formatCurrency(paymentStats!.lastPaymentAmount!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">No. Payments</div>
            <div className="text-neutral-800 font-medium ">
              {paymentStats.numberOfPayments}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PayeePaymentsStats;
