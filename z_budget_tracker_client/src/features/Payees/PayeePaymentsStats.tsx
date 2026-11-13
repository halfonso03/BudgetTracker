import { formatCurrency, formatDate } from '../../app/util';
import { usePayeesPaymentsStats } from '../../api/hooks/payees/usePayeesPaymentsStats';
import Spinner from '../../components/Spinner';
import Label from '../../components/Label';

type Props = {
  payeeId: number;
};

const PayeePaymentsStats = ({ payeeId }: Props) => {
  const { paymentStats, loadingPaymentStats } = usePayeesPaymentsStats(payeeId);

  return (
    <div className="mb-3 gap-4 w-full ">
      {loadingPaymentStats && (
        <div className="mb-1">
          <Spinner></Spinner>
          {/* <Skeleton
            height={50}
            className="mt-0 self-center p-1 flex-1"
            enableAnimation={true}
            containerClassName="flex-1"
          /> */}
        </div>
      )}

      {paymentStats && paymentStats.lastPaymentDate && (
        <div className=" grid grid-cols-[1.3fr_.7fr_1fr_.7fr_.5fr_1fr_.5fr_1fr] gap-2 mb-6">
          <Label>Last Payment Date</Label>
          <div className="text-neutral-800 ">
            {paymentStats.lastPaymentDate
              ? formatDate(paymentStats!.lastPaymentDate!)
              : '-'}
          </div>

          <Label>Average</Label>
          <div className="text-neutral-800 dark:text-white">
            {paymentStats.averagePayment
              ? formatCurrency(paymentStats!.averagePayment!)
              : '-'}
          </div>
          <Label>Smallest</Label>
          <div className=" text-neutral-800 dark:text-white ">
            {paymentStats.lowestPayment
              ? formatCurrency(paymentStats!.lowestPayment!)
              : '-'}
          </div>
          <Label>Largest</Label>
          <div className="text-neutral-800 dark:text-white">
            {paymentStats.highestPayment
              ? formatCurrency(paymentStats!.highestPayment!)
              : '-'}
          </div>
          <Label>Last Payment Amount</Label>
          <div className="text-neutral-800 dark:text-white">
            {paymentStats.lastPaymentAmount
              ? formatCurrency(paymentStats!.lastPaymentAmount!)
              : '-'}
          </div>
          <Label>No. Payments</Label>
          <div className="text-neutral-800  dark:text-white">
            {paymentStats.numberOfPayments}
          </div>
        </div>
      )}
    </div>
  );
};
export default PayeePaymentsStats;
