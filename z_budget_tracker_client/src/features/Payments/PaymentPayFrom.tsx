import { POSTED } from '../../app/constants';
import { formatCurrency } from '../../app/util';
import Label from '../../components/Label';
type Props = {
  paymentSummary: PaymentSummary;
  paymentStatus: number;
};
const PaymentPayFrom = ({ paymentSummary, paymentStatus }: Props) => {
  return (
    <div className="flex justify-between p-5 bg-neutral-200/50 rounded-md shadow-md self-start dark:bg-slate-800/80 dark:border dark:border-slate-700/80">
      <div>
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col items-start ">
            <Label>Initiative</Label>
            <div className=" font-medium text-center text-neutral-950 dark:text-white">
              {paymentSummary?.initiativeName}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <Label>Grant</Label>
            <div className="font-medium text-center text-neutral-950 dark:text-white">
              {paymentSummary.grantName}
            </div>
          </div>

          <div className="flex flex-col items-start ">
            <Label>Category</Label>
            <div className="font-medium text-center text-neutral-950 dark:text-white">
              {paymentSummary?.categoryName}
            </div>
          </div>

          <div className="flex flex-col items-start ">
            <Label>Account</Label>
            <div className="font-medium text-center text-neutral-950 dark:text-white">
              {paymentSummary?.accountName}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4  ">
        <div>
          <Label >
            {paymentStatus !== POSTED && 'Available'}
          </Label>
          <div className="font-medium text-end text-neutral-800 dark:text-white">
            {paymentStatus !== POSTED &&
              formatCurrency(paymentSummary?.available ?? 0)}
          </div>
        </div>
        <div>
          <Label>Total to Pay</Label>
          <div className="text-end text-blue-500 dark:text-indigo-500 font-mono font-medium  ">
            {formatCurrency(paymentSummary?.totalPaid ?? 0)}
          </div>
        </div>
        {paymentStatus !== POSTED && (
          <div>
            <Label>Remaining</Label>
            <div
              className={`text-end font-medium text-neutral-800  ${(paymentSummary?.available ?? 0) - (paymentSummary?.totalPaid ?? 0) < 0 ? 'text-red-500 ' : 'dark:text-white'}`}
            >
              {formatCurrency(
                (paymentSummary?.available ?? 0) -
                  (paymentSummary?.totalPaid ?? 0),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PaymentPayFrom;
