import { Info } from 'lucide-react';
import { POSTED } from '../../app/constants';
import Tooltip from '../../components/Tooltip';

type Props = {
  status: number;
  paymentLineItem: PaymentLineItem;
};
const PaymentNumber = (props: Props) => {
  return (
    <div className="flex w-full  ">
      <div className="flex gap-2 justify-end items-center flex-8 text-end  text-neutral-500 text-[1rem]">
        Payment No.
        {props.status !== POSTED && (
          <div className="self-center cursor-pointer">
            <Tooltip
              text="Payment numbers may not reflect accurately while there are other unposted payments."
              position="top"
            >
              <Info className="text-neutral-500/90" size={16}></Info>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="flex justify-end  items-center gap-2 flex-5 text-end text-neutral-800">
        {props.paymentLineItem.paymentNumber ||
          (props.paymentLineItem?.numberOfPayments ?? 0) + 1}
      </div>
    </div>
  );
};
export default PaymentNumber;
