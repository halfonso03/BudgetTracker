import type {
  Path,
  UseFormGetValues,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form';
import { formatNumber } from '../app/util';
import { useState } from 'react';


interface Props<T extends string> {
  index: number;
  readOnly: boolean;
  disabled: boolean;
  register: UseFormRegisterReturn<T>;
  setValue: UseFormSetValue<ReprogInputRows>;
  getValues: UseFormGetValues<ReprogInputRows>;
  fieldName: string;
  classes?: string;
  onBlur: (isDirty: boolean) => void;
}

const NumericArrayInputGeneric = ({
  index,
  readOnly,
  disabled,
  register,
  setValue,
  getValues,
  classes,
  fieldName,
  onBlur,
}: Props<string>) => {
  const [oldValue] = useState<string | undefined>(() => {
    return getValues(
      `rows.${index}.${fieldName}` as Path<ReprogInputRows>,
    )?.toString();
  });

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
    setValue: UseFormSetValue<ReprogInputRows>,
    index: number,
    amount: string,
  ) {
    setValue(
      `rows.${index}.${fieldName}` as Path<ReprogInputRows>,
      amount.replace(/(?<=\d),(?=\d)/g, '') as unknown as
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
        onBlur(e.target.value.trim() !== oldValue);
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
