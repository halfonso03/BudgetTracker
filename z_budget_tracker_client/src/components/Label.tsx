import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Label = ({ children }: Props) => {
  return <div className="text-neutral-600/70 dark:text-slate-100/80 font-semibold " >{children}</div>;
};
export default Label;
