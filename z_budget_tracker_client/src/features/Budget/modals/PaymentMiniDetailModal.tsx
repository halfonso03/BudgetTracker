import useGetPayment from '../../../api/hooks/payments/useGetPayment';
import {
  formatCurrency,
  formatDate,
  formatDateForCalendar,
  parseFormattedNumber,
} from '../../../app/util';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  paymentId: number;
  initiativeId: number;
  grantId: number;
  accountId: number;
  accountName: string;
};

const PaymentMiniDetailsModal = ({ paymentId, ...props }: Props) => {
  const { data: items, isSuccess } = useGetPayment(paymentId);
  console.log('accountName', props.accountName);
  if (!isSuccess) return <div>Loading...</div>;

  const matchingItems = items?.lineItems.filter(
    (x) =>
      x.initiativeId === props.initiativeId &&
      x.grantId === props.grantId &&
      x.accountId === props.accountId &&
      x.payeeName === props.accountName,
  );

  return (
    <Modal2 size="xl" title="Payment Details" animateOut={false} {...props}>
      <div className="mt-2 gap-4">
        <div className="grid grid-cols-[.2fr_1fr] mb-8 gap-2">
          <div className="font-semibold text-neutral-600 w-20">ID</div>
          <div className="font-semibold">{items?.id}</div>
          <div className="font-semibold text-neutral-600 w-20">Posted By</div>
          <div className="font-semibold">{items?.postedBy}</div>
          <div className="font-semibold text-neutral-600">Date</div>
          <div className="font-semibold">
            {items?.postedDate && formatDate(items.postedDate)}
          </div>
        </div>

        <div className="gap-1 grid grid-cols-[1fr_.6fr_.5fr_.5fr_.4fr_.4fr] border-b mb-2 py-2 border-b-neutral-300">
          <div>
            <div className="text-neutral-600 font-semibold">Pay From</div>
          </div>
          <div className="text-neutral-600 font-semibold">Pay To</div>
          <div className="text-neutral-600 font-semibold">Invoice No.</div>
          <div className="text-neutral-600 font-semibold">Invoice Data</div>
          <div className="text-neutral-600 font-semibold">Check No.</div>
          <div className="text-neutral-600 font-semibold text-end">Amount</div>
        </div>
        {matchingItems?.map((item, index) => (
          <div
            key={index}
            className={`gap-3 grid grid-cols-[1fr_.6fr_.5fr_.5fr_.4fr_.4fr] mb-3 py-2`}
          >
            <div className='grid grid-cols-[.6fr_1fr] gap-3 bg-neutral-200/40 rounded-md p-2 '>
              <div className="text-neutral-600 ">Initiative</div>
              <div>{item.initiativeName}</div>
              <div className="text-neutral-600 ">Award</div>
              <div>{item.grantName}</div>
              <div className="text-neutral-600">Category</div>
              <div>{item.categoryName}</div>
              <div className="text-neutral-600 ">Account</div>
              <div>{item.accountName}</div>
            </div>

            <div className="font-semibold">{item.payeeName}</div>
            <div>{item.invoiceNumber}</div>
            <div>
              {item.invoiceDate && formatDateForCalendar(item.invoiceDate)}
            </div>
            <div>{item.checkNumber}</div>
            <div className=" text-end">
              {formatCurrency(
                parseFormattedNumber(item.paymentAmount.toString()),
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pb-3">
        <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();
            // setAnimateOut(true);
            // setTimeout(() => {
            //   setAnimateOut(false);
            // }, 500);
          }}
        >
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default PaymentMiniDetailsModal;
