import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { usePayeeSearch } from '../../api/hooks/payees/usePayeeSearch';
import ScrollableDiv from '../../components/ScrollableDiv';
import useSelectedPayeeInfo from '../../api/hooks/payments/useSelectedPayeeInfo';

const PayeeSearcher = () => {
  const [p, setP] = useState(false);
  const [query, setQuery] = useState<string>(() => '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [row, setRow] = useState(0);
  const [sel, setSel] = useState(0);
  const [searching, setSearching] = useState(false);

  const { data: suggestions, isFetching } = usePayeeSearch(query);
  const { data } = useSelectedPayeeInfo(
    suggestions ? suggestions[sel].id : undefined,
  );

  console.log('data', data);
  const selectRow = useCallback(
    (amount: number) => {
      if (suggestions && suggestions?.length && suggestions.length > 0) {
        if (amount === -1 && row > 0) {
          setRow((prev) => prev + amount);
        } else if (amount === 1 && row < suggestions.length - 1) {
          setRow((prev) => prev + amount);
        }
      }
    },
    [row, suggestions],
  );

  useEffect(() => {
    inputRef?.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectRow(-1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectRow(1);
      } else if (event.key === 'Enter') {
        if (suggestions && suggestions.length) {
          setSel(row);
          setSearching(false);
        }
      }
    };
    if (
      row !== 0 &&
      (inputRef!.current!.value === '' || suggestions?.length === 0)
    )
      setRow(0);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [row, selectRow, suggestions]);

  return (
    <div className="">
      <div
        className={`flex p-1 rounded-sm ${p ? 'border border-blue-500' : 'border border-neutral-400'}`}
      >
        <input
          ref={inputRef}
          value={query}
          className=' py-2 px-2 w-full rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none  transition-all"
              placeholder="Enter a search term and presss enter..."'
          placeholder="Enter payee name..."
          onFocus={() => {
            setP(true);
          }}
          onBlur={() => setP(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (!isFetching) {
              setQuery(e.target.value);
              if (!searching) setSearching(true);
            }
          }}
        ></input>
      </div>
      <div className="w-full rounded-sm pt-1">
        {suggestions && searching && (
          <ScrollableDiv className="relative border border-neutral-300 rounded-sm w-full">
            {suggestions?.map((item, index) => (
              // Render each suggestion as a clickable list item
              <div
                key={index}
                className={`${row === index ? 'bg-neutral-200' : ''} 
              px-1 flex py-2 justify-between items-center border-b border-b-neutral-300 last:border-b-0 text-neutral-800 dark:text-neutral-300  `}
              >
                <div>{item.name}</div>
                <div>Is Active: {item.isActive ? 'Yes' : 'No'}</div>
                {/* <button
              type="button"
              disabled={item.added || item.existing}
              className={
                item.existing && !item.added
                  ? `bg-neutral-300 dark:bg-neutral-800   text-sm p-1 flex items-center mr-2 opacity-20 `
                  : `bg-green-500 dark:bg-green-600 ` +
                    ` p-1 mr-2 text-neutral-50 dark:text-neutral-200 text-sm cursor-pointer flex items-center justify-between rounded-sm  disabled:cursor-not-allowed disabled:opacity-60`
              }
              onClick={() => onAddUserToRole(item)}
            >
              Add Group
            </button> */}
              </div>
            ))}
          </ScrollableDiv>
        )}
      </div>
    </div>
  );
};
export default PayeeSearcher;
