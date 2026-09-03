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

  // console.log('setSortByValue', setSortByValue)
  // console.log(value, currentSortValue, currentSortValue?.indexOf(value));

  return (
    <div className="flex align-baseline">
      <button
        className="hover:underline cursor-pointer"
        onClick={() => {
          const sortDir = currentSortValue.indexOf('desc') === -1 ? 'desc' : '';
          setSortByValue(value + sortDir);
        }}
      >
        {label}
      </button>
      <span className="ml-2 text-xl">
        {currentSortValue.indexOf(value) !== -1 ? (
          currentSortValue.includes('desc') ? (
            <ArrowDown size={18}></ArrowDown>
          ) : (
            <ArrowUp size={18}></ArrowUp>
          )
        ) : (
          <></>
        )}
      </span>
    </div>
  );
}
