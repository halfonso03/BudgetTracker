import type { RefObject } from 'react';

interface Props {
  readOnly?: boolean;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  ref?: RefObject<HTMLInputElement | null>;
  placeholder?: string;
}

const NumericInputUncontrolled = ({
  readOnly = false,
  disabled = false,
  onBlur = () => {},
  onFocus = () => {},
  onClick = () => {},
  className,
  placeholder,
  ref,
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
      placeholder={placeholder}
      inputMode="decimal"
      readOnly={readOnly}
      disabled={disabled}
      className={classes + ' focus:outline-none focus:ring focus:ring-blue-500'}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onKeyDown={handleOnKeyDown}
      ref={ref}
    />
  );
};
export default NumericInputUncontrolled;
