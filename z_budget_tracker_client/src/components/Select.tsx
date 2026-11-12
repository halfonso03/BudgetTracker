import { type ReactNode } from 'react';

interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  children: ReactNode;
  additionalclasses?: string;
  widthClass?: string;
}

const Select = ({
  children,
  additionalclasses,
  widthClass,
  ...props
}: SelectProps) => {
  const classes =
    ' border border-neutral-200 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-white p-2 rounded-sm text-neutral-800 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:bg-neutral-200 dark:disabled:bg-slate-900 dark:disabled:opacity-50 ' +
    (additionalclasses ?? '') +
    (widthClass ?? ' w-full');

  // const [value, setValue] = useState();

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
};
export default Select;
