import type {
  Path,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form';
import { formatNumber } from '../../app/util';
import Input from '../../components/Input';

interface Props<T extends string> {
  index: number;
  readOnly: boolean;
  disabled: boolean;
  register: UseFormRegisterReturn<T>;
  setValue: UseFormSetValue<PaymentInputRows>;
  fieldName: string;
  classes?: string;
  onBlur: () => void;
}

const PaymentAmountNumericArrayInput = ({
  index,
  readOnly,
  disabled,
  register,
  setValue,
  classes,
  fieldName,
  onBlur,
}: Props<string>) => {
  // const [oldValue] = useState<string | undefined>(() => {
  //   return getValues(
  //     `rows.${index}.${fieldName}` as Path<ReprogInputRows>,
  //   )?.toString();
  // });

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key !== 'Backspace' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'Tab' &&
      e.key !== 'Delete' &&
      e.key !== 'End' &&
      e.key !== 'Home'
    ) {
      if (/[^0-9.]/g.test(e.key)) e.preventDefault();
    }
  }

  function removeNumberFormattingFromArrayField(
    setValue: UseFormSetValue<PaymentInputRows>,
    index: number,
    amount: string,
  ) {
    setValue(
      `rows.${index}.${fieldName}` as Path<PaymentInputRows>,
      amount.replace(/(?<=\d),(?=\d)/g, '') as unknown as
        | number
        | PaymentInputRow
        | PaymentInputRow[]
        | undefined,
    );
  }

  function formatArrayFieldAmount(
    setValue: UseFormSetValue<PaymentInputRows>,
    index: number,
    amount: string,
  ) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (formatter.format(+amount) === 'NaN') {
      setValue(
        `rows.${index}.${fieldName}` as Path<PaymentInputRows>,
        '0.00' as string,
      );
      return;
    }

    setValue(
      `rows.${index}.${fieldName}` as Path<PaymentInputRows>,
      formatNumber(+amount) as string,
    );
  }

  return (
    <Input
      type="text"
      maxLength={10}
      readOnly={readOnly}
      disabled={disabled}
      additionalclasses={classes}
      inputMode="decimal"
      {...register}
      onKeyDown={handleOnKeyDown}
      onBlur={(e) => {
        formatArrayFieldAmount(setValue, index, e.target.value);
        onBlur();
      }}
      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        input.select();
      }}
      onFocus={(e) => {
        removeNumberFormattingFromArrayField(setValue, index, e.target.value);
      }}
    />
  );
};
export default PaymentAmountNumericArrayInput;
