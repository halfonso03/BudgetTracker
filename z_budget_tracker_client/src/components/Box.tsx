import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Box = ({ children }: Props) => {
  return (
    <div className="border border-neutral-200 dark:border-slate-700/60 dark:bg-slate-800/80 
          p-8 flex flex-col justify-center rounded-md gap-5 ">
      {children}
    </div>
  );
};
export default Box;
