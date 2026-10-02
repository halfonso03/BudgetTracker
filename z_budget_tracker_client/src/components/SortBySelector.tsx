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
    <div className="flex items-center">
      <div className="flex">
        <button
          className="hover:underline cursor-pointer w-full"
          onClick={() => {
            const sortDir =
              currentSortValue.indexOf('desc') === -1 ? 'desc' : '';
            setSortByValue(value + sortDir);
          }}
        >
          {label}
        </button>
        <div className=" text-xl">
          {currentSortValue.indexOf(value) !== -1 ? (
            currentSortValue.includes('desc') ? (
              <ArrowDown className="ml-1" size={18}></ArrowDown>
            ) : (
              <ArrowUp className="ml-1" size={18}></ArrowUp>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
