import { parseFormattedNumber } from '../../app/util';
import type {
  FieldError,
  UseFormGetValues,
  UseFormRegisterReturn,
} from 'react-hook-form';
import NumericInputReactHookForm from '../../components/NumericInput';
import { Asterisk } from 'lucide-react';
import type { PaymentFormSchema } from '../../form_schemas/PaymentFormSchema';
import * as Yup from 'yup';
import Label from '../../components/Label';

type FormValues = Yup.InferType<typeof PaymentFormSchema>;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  available: number;
  register: UseFormRegisterReturn<string>;
  getValues: UseFormGetValues<FormValues>;
  error?: FieldError;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onLessThanZero: (n: number) => void;
  onOK: (n: number) => void;
}

const PaymentEntryInput = ({
  available,
  register,
  error,
  onBlur,
  onLessThanZero,
  onOK,
}: Props) => {
  // const [paymentAmount, setPaymentAmount] = useState<number>(
  //   parseFormattedNumber(getValues('paymentAmount')),
  // );

  // const remaining = available - parseFormattedNumber(paymentAmount);

  return (
    <div className="">
      <div className="grid grid-cols-[.35fr_1fr_.1fr] items-center ">
        <Label>Payment Amount</Label>
        <div className="flex items-center w-[35%] relative">
          <NumericInputReactHookForm
            register={register}
            readOnly={false}
            onBlur={(e) => {
              register.onBlur(e);
              onBlur?.(e);
              // setPaymentAmount(parseFormattedNumber(e.target.value));
              if (e.target.value) {
                let value = parseFormattedNumber(e.target.value);
                if (isNaN(value)) value = 0;
                if (available - value >= 0) {
                  onOK?.(value);
                } else {
                  onLessThanZero?.(value);
                }
              }
            }}
            onChange={(e) => {
              register.onChange(e);
              // setPaymentAmount(e.target.value);
            }}
            className="w-full text-start p-2 rounded-sm border border-gray-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500  disabled:bg-neutral-300 
             dark:focus:dark:border-indigo-400  dark:disabled:bg-slate-950 dark:text-neutral-100 dark:bg-slate-800  dark:focus:border-indigo-500"
          ></NumericInputReactHookForm>
          {/* <div>
            {available - paymentAmount < 0 && (
              <div className="text-red-600 mt-2 flex gap-2 items-start">
                <AlertCircle className='' size={24} ></AlertCircle> Amount entered exceeds available
                amount.
              </div>
            )}
          </div> */}
          {error && (
            <div className="text-red-500 pl-1 absolute -right-5">
              <Asterisk size={18}></Asterisk>
            </div>
          )}
        </div>
      </div>
      {/* <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center ">
        <div className="text-neutral-600/90 font-medium">Remaining</div>
        <div
          className={`font-semibold pl-2 ${remaining < 0 ? 'text-red-500' : ''}`}
        >
          {formatCurrency(remaining)}
        </div>
      </div> */}
    </div>
  );
};
export default PaymentEntryInput;
