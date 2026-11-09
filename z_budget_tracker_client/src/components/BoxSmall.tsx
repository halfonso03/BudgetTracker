import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const BoxSmall = ({ children }: Props) => {
  return (
    <div className="border border-neutral-200 dark:border-slate-700/60 dark:bg-slate-800/80 
          p-3 pt-4  rounded-md gap-2 ">
      {children}
    </div>
  );
};
export default BoxSmall;
