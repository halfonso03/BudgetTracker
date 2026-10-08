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
import InfoModal from './modals/InfoModal';
import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import SelectedPayeeCard from './SelectedPayeeCard';

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

  usePayeePayments(selectedPayee?.id ?? 0);

  const { data: suggestions, isFetching } = usePayeeSearch(query);
  const { data: selectedPayeeInfo } = useSelectedPayeeInfo(
    selectedPayee ? selectedPayee.id : 0,
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
    // setSelectedRow(-1);
    setSelectedPayee(null);
    setSearching(false);
  }

  console.log('selectedPayeeInfo', selectedPayeeInfo);
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
        className={`pl-1 pt-1 rounded-sm ${inputFocused ? 'border border-blue-500' : 'border border-neutral-300'}`}
      >
        {selectedPayee && selectedPayeeInfo && (
          <div className='mb-2'>
            <SelectedPayeeCard
              selectedPayee={selectedPayee}
              selectedPayeeInfo={selectedPayeeInfo}
              onRemoveSelection={onRemoveSelection}
              onOpenInfoWindow={() => setInfoWindowIsOpen(true)}
            ></SelectedPayeeCard>
          </div>
        )}
        <input
          ref={inputRef}
          value={query}
          className='p-2 w-full rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none  transition-all"
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
      <div className="relative bg-white opacity-100">
        <div className="w-full rounded-sm pt-1 absolute">
          {suggestions && suggestions.length && searching && (
            <ScrollableDiv className="relative bg-white border border-neutral-300/55 rounded-sm w-full shadow-md ">
              {suggestions?.map((item, index) => (
                // Render each suggestion as a clickable list item
                <div
                  key={index}
                  className={`${highlightedRow === index ? 'bg-neutral-200' : ''} 
                      px-1 pl-2 flex py-1  justify-between items-center border-b border-b-neutral-300/55 last:border-b-0 
                       dark:text-neutral-300`}
                >
                  <div className="p-1 w-full font-medium">
                    <div>{item.name}</div>
                    <div className="grid grid-cols-[.4fr_1fr] w-full text-[.9rem]  ">
                      <div className="pl-1 text-neutral-500  ">Type:</div>
                      <div className="font-medium text-neutral-700">
                        {item.payeeTypeId === 1 ? 'Vendor' : 'Contractor'}
                      </div>
                      <div className="pl-1 text-neutral-500 ">
                        Charge Account:
                      </div>
                      <div className='font-medium text-neutral-600"'>
                        {item.categoryName} / {item.accountName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollableDiv>
          )}
        </div>
      </div>

      <InfoModal
        payeeId={selectedPayee?.id}
        isOpen={infoWindowIsOpen}
        onCancel={() => {
          setInfoWindowIsOpen(false);
        }}
      ></InfoModal>
    </div>
  );
};
export default PayeeSearcher;
