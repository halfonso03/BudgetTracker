import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Label = ({ children }: Props) => {
  return <div className="text-neutral-600 dark:text-slate-400 font-semibold">{children}</div>;
};
export default Label;
