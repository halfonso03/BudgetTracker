import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}
const ScrollableDiv = ({ className, children }: Props) => {
  let allClasses =
    ' overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-200 scrollbar-track-neutral-200 dark:scrollbar-track-transparent';

  if (className) {
    allClasses = className + ' ' + allClasses;
  }

  return <div className={allClasses}>{children}</div>;
};
export default ScrollableDiv;
