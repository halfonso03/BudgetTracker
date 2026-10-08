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
import { Info, X } from 'lucide-react';
import InfoModal from './modals/InfoModal';

type Props = {
  onPayeeSelected: (payee: Payee) => void;
};

const PayeeSearcher = ({ onPayeeSelected }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputFocused, stInputFocused] = useState(false);
  const [query, setQuery] = useState<string>(() => '');

  const [infoWindowIsOpen, setInfoWindowIsOpen] = useState(false);
  //
  const [highlightedRow, setHighlightedRow] = useState(-1);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedRow, setSelectedRow] = useState(-1);

  const { data: suggestions, isFetching } = usePayeeSearch(query);
  const { data: selectedPayeeInfo } = useSelectedPayeeInfo(
    suggestions && suggestions.length && selectedRow > -1 && !searching
      ? suggestions[selectedRow].id
      : undefined,
  );

  console.log('data', selectedPayeeInfo);

  const selectRow = useCallback(
    (amount: number) => {
      if (suggestions && suggestions?.length && suggestions.length > 0) {
        if (amount === -1 && highlightedRow > 0) {
          setHighlightedRow((prev) => prev + amount);
        } else if (amount === 1 && highlightedRow < suggestions.length - 1) {
          setHighlightedRow((prev) => prev + amount);
        }
      }
    },
    [highlightedRow, suggestions],
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
          setSelectedRow(highlightedRow);
          setSelectedPayee(suggestions[highlightedRow]);
          setSearching(false);
          setHighlightedRow(-1);
          setQuery('');
          onPayeeSelected?.(suggestions[highlightedRow]);
        }
      }
    };
    if (highlightedRow !== -1 && inputRef!.current!.value === '')
      setHighlightedRow(-1);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlightedRow, onPayeeSelected, selectRow, suggestions]);

  function onRemoveSelection() {
    setSelectedRow(-1);
    setSelectedPayee(null);
    setSearching(false);
  }

  return (
    <div>
      {/* selectedRow: {selectedRow}
      <br></br>
      highlightedRow{highlightedRow}
      <br></br>
      selectedPayeeInfo name: {selectedPayeeInfo?.name}
      <br></br>
      selectedPayee name: {selectedPayee?.name} */}
      <div
        className={` p-1 rounded-sm ${inputFocused ? 'border border-blue-500' : 'border border-neutral-300'}`}
      >
        {selectedPayee && (
          <div className="flex items-center shadow-md  gap-1 bg-neutral-200/70 rounded-sm">
            <div
              className="cursor-pointer p-2 text-neutral-600 self-stretch hover:text-neutral-900 hover:bg-neutral-100"
              onClick={onRemoveSelection}
            >
              <X size={16}></X>
            </div>
            <div className="flex-1 p-1">
              <div className="text-neutral-700 font-medium">
                <div className="flex justify-between">
                  {selectedPayee?.name}
                  <div
                    className="text-neutral-500 cursor-pointer"
                    onClick={() => setInfoWindowIsOpen(true)}
                  >
                    <Info size={18}></Info>
                  </div>
                </div>
              </div>
              <div className="text-neutral-500 text-[.95rem]">
                [Payee Type:{' '}
                <span className="text-neutral-700">
                  {selectedPayee?.payeeTypeId === 1 ? 'Vendor' : 'Contractor'}]
                </span>
                <br></br>
                [Charge Account:{' '}
                <span className="text-neutral-700">
                  {selectedPayee.categoryName +
                    ' - ' +
                    selectedPayee.accountName}
                </span>
                ]<br></br>
                [Last Payment:{' '}
                <span className="text-neutral-700">10/10/2026 - $1,234</span>]
              </div>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          value={query}
          className=' py-2 px-2 w-full rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none  transition-all"
              placeholder="Enter a search term and presss enter..."'
          placeholder="Enter payee name..."
          onFocus={() => {
            stInputFocused(true);
          }}
          onBlur={() => stInputFocused(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (!isFetching) {
              setQuery(e.target.value);
              if (!searching) setSearching(true);
            }
          }}
        ></input>
      </div>
      <div className='relative bg-white opacity-100'>
        <div className="w-full rounded-sm pt-1 absolute">
          {suggestions && suggestions.length && searching && (
            <ScrollableDiv className="relative bg-white border border-neutral-300/55 rounded-sm w-full shadow-md ">
              {suggestions?.map((item, index) => (
                // Render each suggestion as a clickable list item
                <div
                  key={index}
                  className={`${highlightedRow === index ? 'bg-neutral-200' : ''} 
                      px-1 pl-2 flex py-2 justify-between items-center border-b border-b-neutral-300/55 last:border-b-0 
                      text-neutral-800 dark:text-neutral-300`}
                >
                  <div className="p-1 w-full">
                    <div className="font-medium">{item.name}</div>
                    <div className="flex gap-2 items-center w-full  ">
                      {/* <div className="flex items-center gap-1 text-sm ">
                        <div className="pl-1 text-neutral-500 font-medium tracking-wider">
                          Lasy Payment:
                        </div>
                        <div className="font-medium text-neutral-600">
                          12/12/2026
                        </div>
                      </div> */}

                      <div className="flex  items-center gap-1 text-sm">
                        <div className="pl-1 text-neutral-500 font-medium tracking-wider">
                          Type:
                        </div>
                        <div className="font-medium text-neutral-600">
                          {item.payeeTypeId === 1 ? 'Vendor' : 'Contractor'}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex text-sm gap-1">
                      <div className="pl-1 text-neutral-500 font-medium tracking-wider">
                        Charge Account:
                      </div>
                      <div className='font-medium text-neutral-600"'>
                        {item.categoryName} / {item.accountName}
                      </div>
                    </div>
                  </div>

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

      <InfoModal
        isOpen={infoWindowIsOpen}
        onCancel={() => {
          setInfoWindowIsOpen(false);
        }}
      ></InfoModal>
    </div>
  );
};
export default PayeeSearcher;
