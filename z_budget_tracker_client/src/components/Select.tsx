import type { ReactNode } from 'react';

interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  additionalclasses?: string;
}

const Select = ({ children, additionalclasses, ...props }: SelectProps) => {
  const classes =
    'text-neutral-600 rounded-sm p-2 border border-neutral-300 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-90 disabled:bg-neutral-200 ' +
    (additionalclasses ?? '');

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
};
export default Select;
