import useGetPayment from '../../../api/hooks/payments/useGetPayment';
import {
  formatCurrency,
  formatDate,
  formatDateForCalendar,
  parseFormattedNumber,
} from '../../../app/util';
import Button from '../../../components/Button';
import Label from '../../../components/Label';
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
          <Label>ID</Label>
          <div className="font-medium dark:text-white">{items?.id}</div>
          <Label>Posted By</Label>
          <div className="font-medium dark:text-white">{items?.postedBy}</div>
          <Label>Date</Label>
          <div className="font-medium dark:text-white">
            {items?.postedDate && formatDate(items.postedDate)}
          </div>
        </div>
        <div className="gap-1 grid grid-cols-[1fr_1fr_.35fr_.35fr_.35fr_.5fr] border-b py-2 border-b-neutral-300 dark:border-b-slate-700/80">
          <Label>Pay From</Label>
          <Label>Pay To</Label>
          <Label>Invoice No.</Label>
          <Label>Invoice Date</Label>
          <Label>Check No.</Label>
          <div className="flex justify-end">
            <Label>Amount</Label>
          </div>
        </div>
        {matchingItems?.map((item, index) => (
          <div
            key={index}
            className={`gap-2 grid grid-cols-[1fr_1fr_.35fr_.35fr_.35fr_.5fr] mb-3  `}
          >
            <div className="grid grid-cols-[.6fr_1fr] gap-3 border-r border-r-neutral-300  dark:border-r-slate-700/80 p-2 ">
              <Label>Initiative</Label>
              <div className="dark:text-white">{item.initiativeName}</div>
              <Label>Award</Label>
              <div className="dark:text-white">{item.grantName}</div>
              <Label>Category</Label>
              <div className="dark:text-white">{item.categoryName}</div>
              <Label>Account</Label>
              <div className="dark:text-white">{item.accountName}</div>
            </div>
            <div className="font-semibold pt-2 dark:text-white ">
              {item.payeeName}
            </div>
            <div className="pt-2 dark:text-white">{item.invoiceNumber}</div>
            <div className="pt-2 dark:text-white">
              {item.invoiceDate && formatDateForCalendar(item.invoiceDate)}
            </div>
            <div className="pt-2 dark:text-white">{item.checkNumber}</div>
            <div className=" text-end pt-2 dark:text-white">
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
