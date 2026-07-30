import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  readOnly: boolean;
  disabled: boolean;
  
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  register: UseFormRegisterReturn<`rows.${number}.amount`>;
}


const NumericArrayInput = ({
  readOnly,
  disabled,
  onBlur,
  onFocus,
  register,
}: Props) => {
  function handleOnKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key !== 'Backspace' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'Tab' &&
      e.key !== 'Delete' &&
      e.key !== 'End'
    ) {
      if (/[^0-9.]/g.test(e.key)) e.preventDefault();
    }
  }

  return (
    <input
      
      type="text"
      maxLength={10}
      inputMode="decimal"
      {...register}
      readOnly={readOnly}
      disabled={disabled}
      onKeyDown={handleOnKeyUp}
      className={`p-[.1rem] w-35 border text-end `}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
export default NumericArrayInput;
