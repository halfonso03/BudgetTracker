type ButtonStyle = 'primary' | 'secondary' | 'danger' | 'danger2';
type Sizes = 'small' | 'medium' | 'large';
type ButtonType = 'button' | 'submit';

interface ButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  variation?: ButtonStyle;
  buttonSize?: Sizes;
  type?: ButtonType;
  additionalclasses?: string;
}

const Button = ({
  variation = 'primary',
  buttonSize = 'medium',
  children,
  type = 'button',
  additionalclasses = '',
  ...props
}: ButtonProps) => {
  let classes =
    'cursor-pointer rounded-sm shadow-sm w-25 flex justify-center items-center ';

  if (buttonSize == 'small') {
    classes += 'text-sm p-3 w-25 ';
  } else if (buttonSize == 'medium') {
    classes += 'text-base p-3 w-40 ';
  } else if (buttonSize == 'large') {
    classes += 'text-lg p-3 w-50 ';
  }

  if (variation == 'primary') {
    classes +=
      'text-gray-50 border bg-blue-600 border-blue-400 hover:bg-blue-500 dark:bg-green-800 disabled:opacity-50 disabled:bg-blue-500 dark:disabled:bg-green-700 dark:border-green-500 shadow-md dark:hover:bg-green-700 transition-all duration-200';
  } else if (variation == 'secondary') {
    classes +=
      'text-gray-800 bg-gray-200 border border-gray-300 shadow-md hover:bg-neutral-300 hover:border-gray-300 dark:bg-transparent dark:text-white dark:border-gray-600 dark:hover:bg-neutral-800 dark:hover:border-gray-600 transition-all duration-200';
  } else if (variation == 'danger') {
    classes +=
      'text-red-100 bg-red-700 border border-red-900 hover:bg-red-800 shadow-md transition-all duration-200';
  }

  classes += ' ' + additionalclasses;

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};
export default Button;
