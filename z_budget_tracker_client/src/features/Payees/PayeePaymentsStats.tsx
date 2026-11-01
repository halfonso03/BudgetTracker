import { formatCurrency, formatDate } from '../../app/util';
import { usePayeesPaymentsStats } from '../../api/hooks/payees/usePayeesPaymentsStats';
import Skeleton from 'react-loading-skeleton';

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
            <Skeleton
              height={50}
              className="mt-0 self-center p-1 flex-1"
              enableAnimation={true}
              containerClassName="flex-1"
            />
          </div>
        )}

        {paymentStats && paymentStats.lastPaymentDate && (
          <div className="border-b border-b-neutral-200 grid grid-cols-[1.3fr_.7fr_1fr_.7fr_.5fr_1fr_.5fr_1fr] gap-2">
            <div className="text-neutral-400 ">
              Last Payment Date
            </div>
            <div className="text-neutral-800 ">
              {paymentStats.lastPaymentDate
                ? formatDate(paymentStats!.lastPaymentDate!)
                : '-'}
            </div>

            <div className="text-neutral-400 ">Average</div>
            <div className="text-neutral-800 ">
              {paymentStats.averagePayment
                ? formatCurrency(paymentStats!.averagePayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 ">Smallest</div>
            <div className=" text-neutral-800 ">
              {paymentStats.lowestPayment
                ? formatCurrency(paymentStats!.lowestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 ">Largest</div>
            <div className="text-neutral-800 ">
              {paymentStats.highestPayment
                ? formatCurrency(paymentStats!.highestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 ">
              Last Payment Amount
            </div>
            <div className="text-neutral-800 ">
              {paymentStats.lastPaymentAmount
                ? formatCurrency(paymentStats!.lastPaymentAmount!)
                : '-'}
            </div>
            <div className="text-neutral-400 ">No. Payments</div>
            <div className="text-neutral-800  ">
              {paymentStats.numberOfPayments}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PayeePaymentsStats;
