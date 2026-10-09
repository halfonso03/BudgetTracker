import { formatCurrency, parseFormattedNumber } from '../../app/util';
import type {
  FieldError,
  UseFormGetValues,
  UseFormRegisterReturn,
} from 'react-hook-form';
import NumericInputReactHookForm from '../../components/NumericInput';
import { Asterisk } from 'lucide-react';
import type { PaymentFormSchema } from '../../form_schemas/PaymentFormSchema';
import * as Yup from 'yup';
import { useState } from 'react';

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
  getValues,
  onLessThanZero,
  onOK,
}: Props) => {
  // console.log('errorMessage', error);

  const [paymentAmount, setPaymentAmount] = useState(getValues('amount'));

  // const remainingRef = useRef(available - parseFormattedNumber(paymentAmount));

  const remaining = available - parseFormattedNumber(paymentAmount);

  // console.log('paymentAmount', paymentAmount);

  // useEffect(() => {
  //   if (remaining < 0) {
  //     onLessThanZero(remaining);
  //   } else {
  //     onOK(remaining);
  //   }
  // }, [onLessThanZero, onOK, remaining]);

  return (
    <div>
      <div className="grid grid-cols-[.5fr_.85fr_.5fr]  w-full items-center mb-5">
        <div className="text-neutral-600/90 font-medium">Available</div>
        <div className="font-semibold pl-1">{formatCurrency(available)}</div>
      </div>

      <div className="grid grid-cols-[.5fr_.85fr_.5fr]  w-full items-center mb-5">
        <div className="text-neutral-600/90 font-medium">
          <div className="flex items-baseline gap-2 text-red-600">
            Payment Amount
          </div>
        </div>
        <NumericInputReactHookForm
          register={register}
          readOnly={false}
          onBlur={(e) => {
            register.onBlur(e);
            onBlur?.(e);
            setPaymentAmount(e.target.value);
            if (e.target.value) {
              const value = parseFormattedNumber(e.target.value);

              if (available - value >= 0) {
                onOK?.(value);
              } else {
                onLessThanZero?.(value);
              }
            }
          }}
          onChange={(e) => {
            register.onChange(e);
            setPaymentAmount(e.target.value);
          }}
          className="w-full text-start p-2 rounded-sm border border-gray-300  focus:outline-none focus:border-neutral-400 disabled:bg-neutral-300 
            focus:dark:border-gray-100 dark:disabled:bg-neutral-950 dark:text-neutral-100 dark:bg-neutral-800 dark:border-gray-500"
        ></NumericInputReactHookForm>
        {error && (
          <div className="text-red-500 pl-1">
            <Asterisk size={18}></Asterisk>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[.5fr_.85fr_.5fr] w-full items-center mb-5">
        <div className="text-neutral-600/90 font-medium">Remaining</div>
        <div
          className={`font-semibold pl-1 ${remaining < 0 ? 'text-red-500' : ''}`}
        >
          {formatCurrency(remaining)}
        </div>
      </div>
    </div>
  );
};
export default PaymentEntryInput;
