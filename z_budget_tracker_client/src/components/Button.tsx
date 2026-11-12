type ButtonStyle = 'primary' | 'secondary' | 'danger' | 'danger2';
type Sizes = 'xsmall' | 'small' | 'medium' | 'large';
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
    'cursor-pointer disabled:cursor-not-allowed rounded-sm shadow-sm flex justify-center items-center ';

  if (buttonSize == 'xsmall') {
    classes += ' w-15 p-1';
  } else if (buttonSize == 'small') {
    classes += ' p-2 w-35 ';
  } else if (buttonSize == 'medium') {
    classes += 'text-base p-2 w-45 ';
  } else if (buttonSize == 'large') {
    classes += 'text-lg p-3 w-60 ';
  }

  if (variation == 'primary') {
    classes +=
      ' w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-indigo-600 hover:bg-blue-800 dark:hover:bg-indigo-500 active:bg-blue-500 dark:active:bg-indigo-700 rounded-lg transition-all shadow-md dark:shadow-indigo-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-indigo-500/40';
  } else if (variation == 'secondary') {
    classes +=
      'w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:bg-slate-100 dark:active:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-500/40';
  } else if (variation == 'danger') {
    classes +=
      ' text-neutral-100 bg-red-500 border border-red-600 hover:bg-red-600 shadow-md transition-all duration-300 disabled:opacity-50';
  }

  return (
    <button
      type={type}
      className={`${classes} ${additionalclasses}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
