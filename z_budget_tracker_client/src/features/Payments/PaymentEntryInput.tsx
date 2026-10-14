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

  const [paymentAmount, setPaymentAmount] = useState(
    getValues('paymentAmount'),
  );

  const remaining = available - parseFormattedNumber(paymentAmount);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center ">
        <div className="text-neutral-600/90 font-medium">Available</div>
        <div
          className={`pl-2 ${available < 0 ? 'text-red-500 font-semibold' : ''}`}
        >
          {formatCurrency(available)}
        </div>
      </div>
      <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center ">
        <div className="  text-neutral-600/90 font-medium">
          Payment Amount
        </div>
        <div>
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
            className="w-[40%] text-start p-2 rounded-sm border border-gray-300  focus:outline-none focus:border-neutral-400 disabled:bg-neutral-300 
            focus:dark:border-gray-100 dark:disabled:bg-neutral-950 dark:text-neutral-100 dark:bg-neutral-800 dark:border-gray-500"
          ></NumericInputReactHookForm>
        </div>

        {error && (
          <div className="text-red-500 pl-1">
            <Asterisk size={18}></Asterisk>
          </div>
        )}
      </div>
      <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center ">
        <div className="text-neutral-600/90 font-medium">Remaining</div>
        <div
          className={`font-semibold pl-2 ${remaining < 0 ? 'text-red-500' : ''}`}
        >
          {formatCurrency(remaining)}
        </div>
      </div>
    </div>
  );
};
export default PaymentEntryInput;
