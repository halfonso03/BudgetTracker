import PaymentPayee from './PaymentPayee';

type Props = {
  payments: PaymentLineItem[];
  paymentHeader: PaymentHeader;
  onEditRow: (uuid: string) => void;
  onDeleteRow: (p: PaymentLineItem) => void;
  onAddPaymentToBudget: (i: number, g: number, c: number, a: number) => void;
  paymentSummary: PaymentSummary;
  isOverBudget: boolean;
};

// isOverBudget,
const PaymentPayees = ({
  onEditRow,
  onDeleteRow,
  payments,
  paymentHeader,
}: Props) => {
  return (
    <div className=" w-[90%] ">
      <div className="flex flex-col gap-6 text-[1.04rem]">
        {payments.map((p, i) => (
          <PaymentPayee
            key={i}
            p={p}
            paymentHeader={paymentHeader}
            onDeleteRow={onDeleteRow}
            onEditRow={onEditRow}
          ></PaymentPayee>
        ))}
      </div>
    </div>
  );
};

export default PaymentPayees;

{
  /*
    <div className="grid grid-cols-[1fr_1fr] w-full ">
        <div className="p-2 text-neutral-600/90 bg-neutral-50 font-semibold -neutral-300/60   -r-0">
          Payments
        </div>
        <div className="p-2 text-center text-neutral-600/90 bg-neutral-50 font-semibold  -neutral-300/60   ">
          Amount
        </div>
        {payments.map((p, i) => (
          <Fragment key={i}>
            <div className="p-2  -l  -neutral-300/60 -b ">
              {p.payeeName}
            </div>
            <div className="p-2 text-center -l -r -neutral-300/60  -b relative">
              {formatCurrency(+p.paymentAmount)}

              {paymentHeader.status !== POSTED && (
                <div className="flex absolute right-0 top-0  py-2  ">
                  <div className="flex gap-4 pr-2 ">
                    <Pencil
                      size={20}
                      className={`text-neutral-400 cursor-pointer  hover:text-blue-500 duration-200 transition-all hover:scale-125`}
                      onClick={() => onEditRow(p.uuid)}
                    ></Pencil>
                    <TrashIcon
                      className="text-red-600 opacity-60 cursor-pointer duration-200 transition-all hover:scale-125 hover:opacity-100"
                      size={20}
                      onClick={() => onDeleteRow(p)}
                    ></TrashIcon>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        ))}

        <div className="p-2 font-semibold text-neutral-600/90 bg-neutral-50  -neutral-300/60   -r-0 -t-0">
          Total
        </div>
        <div
          className={`${isOverBudget && 'text-red-600/70'} flex justify-center gap-2 items-center p-2 pr-1 font-semibold text-center text-neutral-800 bg-neutral-50 -neutral-300/60   -t-0`}
        >
          {formatCurrency(
            +payments
              .map((x) => parseFormattedNumber(x.paymentAmount.toString()))
              .reduce((acc, cur) => acc + cur, 0),
          )}
        </div>
      </div>
  */
}
