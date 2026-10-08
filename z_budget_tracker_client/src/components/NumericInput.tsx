import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  readOnly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  register?: UseFormRegisterReturn<string>;
  className?: string;
}

const NumericInputReactHookForm = ({
  readOnly = true,
  onBlur = () => {},
  onFocus = () => {},
  onClick = () => {},
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

  const classes = ' ' + className;

  return (
    <input
      type="text"
      maxLength={10}
      inputMode="decimal"
      {...register}
      readOnly={readOnly}
      className={classes}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onKeyDown={handleOnKeyDown}
    />
  );
};
export default NumericInputReactHookForm;
