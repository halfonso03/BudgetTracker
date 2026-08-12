import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  readOnly: boolean;
  disabled: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  register?: UseFormRegisterReturn<`rows.${number}.amount`>;
  className?: string;
}

const NumericInput = ({
  readOnly,
  disabled,
  onBlur,
  onFocus,
  onClick,
  register,
  className,
}: Props) => {
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

  const classes = ' w-35 border text-end  ' + className;

  return (
    <input
      type="text"
      maxLength={10}
      inputMode="decimal"
      {...register}
      readOnly={readOnly}
      disabled={disabled}
      className={classes}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onKeyDown={handleOnKeyDown}
    />
  );
};
export default NumericInput;
