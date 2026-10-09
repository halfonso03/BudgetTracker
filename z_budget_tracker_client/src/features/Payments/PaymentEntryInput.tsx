import { formatCurrency } from '../../app/util';
import type {
  FieldError,
  UseFormGetValues,
  UseFormRegisterReturn,
} from 'react-hook-form';
import NumericInputReactHookForm from '../../components/NumericInput';
import { Asterisk } from 'lucide-react';
import type { PaymentFormSchema } from '../../form_schemas/PaymentFormSchema';
import * as Yup from 'yup';

type FormValues = Yup.InferType<typeof PaymentFormSchema>;

type Props = {
  available: number;
  register: UseFormRegisterReturn<string>;
  getValues: UseFormGetValues<FormValues>;
  error?: FieldError;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const PaymentEntryInput = ({
  available,
  register,
  error,
  onBlur,
  getValues,
}: Props) => {
  // console.log('errorMessage', error);
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
          onBlur={onBlur}
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
        <div className="font-semibold pl-1">{getValues('amount')}</div>
      </div>
    </div>
  );
};
export default PaymentEntryInput;
