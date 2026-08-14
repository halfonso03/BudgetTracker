import type {
  Path,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form';
import { formatNumber } from '../app/util';

interface Props<T extends string> {
  index: number;
  readOnly: boolean;
  disabled: boolean;
  register: UseFormRegisterReturn<T>;
  setValue: UseFormSetValue<ReprogInputRows>;
  fieldName: string;
  className?: string;
}

const NumericArrayInputGeneric = ({
  index,
  readOnly,
  disabled,
  register,
  setValue,
  className,
  fieldName,
}: Props<string>) => {
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

  const classes = '  ' + (className ?? '');

  function removeNumberFormattingFromArrayField(
    setValue: UseFormSetValue<ReprogInputRows>,
    index: number,
    amount: string,
  ) {
    const result = amount.replace(/(?<=\d),(?=\d)/g, '');

    setValue(
      `rows.${index}.${fieldName}` as Path<ReprogInputRows>,
      result as unknown as
        | number
        | ReprogInputRow
        | ReprogInputRow[]
        | undefined,
    );
  }

  function formatArrayFieldAmount(
    setValue: UseFormSetValue<ReprogInputRows>,
    index: number,
    amount: string,
  ) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (formatter.format(+amount) === 'NaN') {
      setValue(
        `rows.${index}.${fieldName}` as Path<ReprogInputRows>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        '0.00' as any,
      );
      return;
    }

    setValue(
      `rows.${index}.${fieldName}` as Path<ReprogInputRows>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatNumber(+amount) as any,
    );
  }

  return (
    <input
      type="text"
      maxLength={10}
      readOnly={readOnly}
      disabled={disabled}
      className={classes}
      inputMode="decimal"
      {...register}
      onKeyDown={handleOnKeyDown}
      onBlur={(e) => {
        formatArrayFieldAmount(setValue, index, e.target.value);
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
export default NumericArrayInputGeneric;
