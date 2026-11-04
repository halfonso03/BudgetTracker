import { POSTED } from '../../app/constants';
import { formatCurrency } from '../../app/util';
type Props = {
  paymentSummary: PaymentSummary;
  paymentStatus: number;
};
const PaymentPayFrom = ({ paymentSummary, paymentStatus }: Props) => {
  return (
    <div className="flex justify-between p-5 bg-neutral-200/50 rounded-md shadow-md self-start">
      <div>
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col items-start ">
            <div className=" text-neutral-600/90 text-center   ">
              Initiative
            </div>
            <div className=" font-medium text-center text-neutral-950">
              {paymentSummary?.initiativeName}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className=" text-neutral-600/90 text-center   ">Grant</div>
            <div className="font-medium text-center text-neutral-950">
              {paymentSummary.grantName}
            </div>
          </div>

          <div className="flex flex-col items-start ">
            <div className=" text-neutral-600/90 text-center   ">Category</div>
            <div className="font-medium text-center text-neutral-950">
              {paymentSummary?.categoryName}
            </div>
          </div>

          <div className="flex flex-col items-start ">
            <div className=" text-neutral-600/90 text-center  ">Account</div>
            <div className="font-medium text-center text-neutral-950">
              {paymentSummary?.accountName}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4  ">
        <div>
          <div className="text-neutral-600/90 text-end">
            {paymentStatus !== POSTED && 'Available'}
          </div>
          <div className="font-medium text-end text-neutral-800">
            {paymentStatus !== POSTED &&
              formatCurrency(paymentSummary?.available ?? 0)}
          </div>
        </div>
        <div>
          <div className="text-end text-neutral-600/90">Total to Pay</div>
          <div className="text-end text-blue-500 font-medium  ">
            {formatCurrency(paymentSummary?.totalPaid ?? 0)}
          </div>
        </div>
        {paymentStatus !== POSTED && (
          <div>
            <div className="text-end text-neutral-600/90">Remaining</div>
            <div
              className={`text-end font-medium text-neutral-800 ${(paymentSummary?.available ?? 0) - (paymentSummary?.totalPaid ?? 0) < 0 && 'text-red-500 '}`}
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
