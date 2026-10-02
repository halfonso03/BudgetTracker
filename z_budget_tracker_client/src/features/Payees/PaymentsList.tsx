import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import { formatCurrency, formatDate } from '../../app/util';

type Props = {
  payeeId: number;
};
const PaymentsList = ({ payeeId }: Props) => {
  const { payments } = usePayeePayments(payeeId);

  if (!payments) return null;

  return (
    <div>
      <div className=" ">
        <div className="font-semibold text-neutral-700 text-xl border-b border-b-neutral-300 pl-0 p-1 mb-4">
          Payments
        </div>
      </div>
      {payments && (
        <>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr]">
            <div className="font-semibold">ID</div>
            <div className="font-semibold">Year</div>
            <div className="font-semibold text-center">Posted Date</div>
            <div className="font-semibold text-center">Amount</div>
            <div className="font-semibold text-center">Posted By</div>
          </div>
          {payments.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr]">
              <div>{p.id}</div>
              <div>{p.year}</div>
              <div className='text-center'>{formatDate(p.postedDate)}</div>
              <div className='text-center'>{formatCurrency(p.amount)}</div>
              <div className='text-center'>{p.postedBy}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default PaymentsList;
