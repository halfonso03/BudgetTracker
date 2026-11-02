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
          <div className="font-medium text-neutral-600 w-20">ID</div>
          <div className="font-medium">{items?.id}</div>
          <div className="font-medium text-neutral-600 w-20">Posted By</div>
          <div className="font-medium">{items?.postedBy}</div>
          <div className="font-medium text-neutral-600">Date</div>
          <div className="font-medium">
            {items?.postedDate && formatDate(items.postedDate)}
          </div>
        </div>
        <div className="gap-1 grid grid-cols-[1fr_.6fr_.5fr_.5fr_.5fr_.5fr] border-b py-2 border-b-neutral-300">
          <div className="text-neutral-600 font-medium">Pay From</div>
          <div className="text-neutral-600 font-medium">Pay To</div>
          <div className="text-neutral-600 font-medium">Invoice No.</div>
          <div className="text-neutral-600 font-medium">Invoice Date</div>
          <div className="text-neutral-600 font-medium">Check No.</div>
          <div className="text-neutral-600 font-medium text-end">Amount</div>
        </div>
        {matchingItems?.map((item, index) => (
          <div
            key={index}
            className={`gap-2 grid grid-cols-[1fr_.6fr_.5fr_.5fr_.5fr_.5fr] mb-3  `}
          >
            <div className="grid grid-cols-[.6fr_1fr] gap-3 border-r border-r-neutral-300  p-2 ">
              <div className="text-neutral-600 ">Initiative</div>
              <div>{item.initiativeName}</div>
              <div className="text-neutral-600 ">Award</div>
              <div>{item.grantName}</div>
              <div className="text-neutral-600">Category</div>
              <div>{item.categoryName}</div>
              <div className="text-neutral-600 ">Account</div>
              <div>{item.accountName}</div>
            </div>
            <div className="font-semibold pt-2 ">{item.payeeName}</div>
            <div className="pt-2">{item.invoiceNumber}</div>
            <div className="pt-2">
              {item.invoiceDate && formatDateForCalendar(item.invoiceDate)}
            </div>
            <div className="pt-2">{item.checkNumber}</div>
            <div className=" text-end pt-2">
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
