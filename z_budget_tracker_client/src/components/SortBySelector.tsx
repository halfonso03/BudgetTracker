import { ArrowDown, ArrowUp } from 'lucide-react';
import { useSortingContext } from '../contexts/useSortingContext';

type Props = {
  label: string;
  value: string;
  currentSortValue: string;
};

export default function SortBySelector({
  label,
  value,
  currentSortValue,
}: Props) {
  const { setSortByValue } = useSortingContext();

  return (
    <div className="hover:text-neutral-900 dark:hover:text-slate-200 dark:text-slate-200/90 transition-colors duration-150 w-full">
      <div className="flex items-center  w-full">
        <button
          className="flex cursor-pointer font-medium capitalize select-none"
          onClick={() => {
            const sortDir =
              currentSortValue.indexOf('desc') === -1 ? 'desc' : '';
            setSortByValue(value + sortDir);
          }}
        >
          {label}
          {currentSortValue.indexOf(value) !== -1 ? (
            currentSortValue.includes('desc') ? (
              <ArrowDown className="ml-1" size={18}></ArrowDown>
            ) : (
              <ArrowUp className="ml-1" size={18}></ArrowUp>
            )
          ) : (
            <></>
          )}
        </button>
      </div>
    </div>
  );
}
