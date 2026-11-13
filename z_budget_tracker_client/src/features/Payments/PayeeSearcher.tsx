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
import SelectedPayeeCard from './SelectedPayeeCard';
import Spinner from '../../components/Spinner';
import { Plus } from 'lucide-react';
import NewPayeeWindow from './NewPayeeWindow';

type Props = {
  onPayeeSelected: (payee: Payee) => void;
  onPayeeSelectionCleared: () => void;
  payeeId?: number | null;
  onPayeeCreated: (payee: Payee) => void;
};

const PayeeSearcher = ({
  payeeId,
  onPayeeSelected,
  onPayeeSelectionCleared,
  onPayeeCreated,
}: Props) => {
  let payeeIdToFind = 0;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputFocused, stInputFocused] = useState(false);
  const [query, setQuery] = useState<string>(() => '');
  const [infoWindowIsOpen, setInfoWindowIsOpen] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(-1);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [searching, setSearching] = useState(false);
  const [addNewPayeeModalisOpen, setAddNewPayeeModalIsOpen] = useState(false);

  if (selectedPayee) {
    payeeIdToFind = selectedPayee.id;
  } else if (payeeId && payeeId !== 0) {
    payeeIdToFind = payeeId;
  }

  const { data: suggestions, isFetching } = usePayeeSearch(query);

  const {
    data: selectedPayeeInfoFromDb,
    isSuccess: loadPayeeSuccess,
  } = useSelectedPayeeInfo(payeeIdToFind);

  if (loadPayeeSuccess) {
    if (!selectedPayee && selectedPayeeInfoFromDb)
      setSelectedPayee(selectedPayeeInfoFromDb);
  }

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectRow(-1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectRow(1);
      } else if (event.key === 'Enter') {
        if (suggestions && suggestions.length) {
          if (highlightedRow > -1) {

           
            setSelectedPayee(suggestions[highlightedRow]);
            setSearching(false);
            setHighlightedRow(-1);
            setQuery('');
            onPayeeSelected?.(suggestions[highlightedRow]);
          }
        }
      }
    };
    // if (highlightedRow !== -1 && inputRef!.current!.value === '')
    // setHighlightedRow(-1);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlightedRow, onPayeeSelected, selectRow, suggestions]);

  function onRemoveSelection() {
    setSelectedPayee(null);
    setSearching(false);
    onPayeeSelectionCleared();
  }

  return (
    <div>
      <div
        className={` ${isFetching && 'bg-neutral-200 dark:bg-transparent'}  rounded-sm ${inputFocused ? 'border border-blue-500 dark:border-slate-600' : 'border border-neutral-300 dark:border-slate-700'}`}
      >
        {/* {loadginSelectedPayeeInfo && (
          <Skeleton
            height={70}
            width="100%"
            className=""
            enableAnimation={true}
            containerClassName="flex-1 self-stretch"
          />
        )} */}
        {selectedPayee && selectedPayeeInfoFromDb && (
          <div className="m-1">
            <SelectedPayeeCard
              selectedPayeeInfo={selectedPayeeInfoFromDb}
              onRemoveSelection={onRemoveSelection}
              onOpenInfoWindow={() => setInfoWindowIsOpen(true)}
            ></SelectedPayeeCard>
          </div>
        )}
        <div className="flex items-center relative border-t border-t-neutral-200 dark:border-t-slate-700/60">
          <input
            ref={inputRef}
            value={query}
            className="cursor-pointer p-2 w-full rounded-sm text-neutral-800 dark:text-white placeholder-neutral-400 focus:outline-none transition-all dark:placeholder-slate-400 focus:border-neutral-400 dark:focus:border-indigo-400"
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
          {isFetching && (
            <div className="mr-2">
              <Spinner color='neutral'></Spinner>
            </div>
          )}
          {suggestions && suggestions.length === 0 && (
            <div className="mr-3 w-[45%] italic text-end text-neutral-400 dark:text-white ">
              no results found
            </div>
          )}
          <div className=' flex items-center mr-1'>
            <button
              type="button"
              onClick={() => setAddNewPayeeModalIsOpen(true)}
              tabIndex={-1}
            >
              <Plus className="border border-transparent hover:border-neutral-400 dark:hover:border-slate-700 hover:bg-neutral-300/60 dark:hover:bg-slate-600 rounded-sm  text-neutral-500 dark:text-slate-200 hover:text-neutral-600 dark:hover:text-slate-100 duration-200 transition-all cursor-pointer"></Plus>
            </button>
          </div>

          {/* <div className="absolute  w-80 right-0 top-0 z-30000 menu border border-red-700 p-2  bg-red-500">
            <div className="border border-blue-300 w-full p-2 ">N</div>
          </div> */}
        </div>
      </div>
      <div className="relative bg-white dark:bg-slate-700/80 opacity-100">
        <div className="w-full rounded-md pt-1 absolute z-1000 ">
          {suggestions && suggestions.length > 0 && searching && (
            <ScrollableDiv className=" bg-white dark:bg-slate-800 border border-neutral-300/55 dark:border-slate-600 rounded-sm w-full shadow-md ">
              {suggestions?.map((item, index) => (
                // Render each suggestion as a clickable list item
                <div
                  key={index}
                  onClick={() => {
                    setSelectedPayee(suggestions[index]);
                    setSearching(false);
                    setHighlightedRow(-1);
                    setQuery('');
                    onPayeeSelected?.(suggestions[index]);
                  }}
                  className={`${highlightedRow === index ? 'bg-neutral-200/60' : ''} 
                      px-1 pl-2 flex py-1 justify-between items-center border-b border-b-neutral-300/55 dark:border-b-slate-600 last:border-b-0 
                       dark:text-neutral-300 cursor-pointer hover:bg-neutral-200 dark:hover:bg-slate-600`}
                >
                  <div className="p-1 w-full font-semibold">
                    <div className='dark:text-white'>{item.name}</div>
                    <div className=" w-full text-[.9rem]  ">
                      <div className="text-neutral-500 dark:text-slate-300  ">
                        [Payee Type:
                        <span className="font-medium text-neutral-900 pl-2 dark:text-white">
                          {item.payeeTypeId === 1 ? 'Vendor' : 'Contractor'}
                        </span>
                        ]
                      </div>
                      <div className="text-neutral-500 dark:text-slate-300">
                        [Charge Account:
                        <span className="font-medium text-neutral-900 pl-2 dark:text-white">
                          {item.categoryName} / {item.accountName}
                        </span>
                        ]
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
        payee={selectedPayee}
        isOpen={infoWindowIsOpen}
        onCancel={() => {
          setInfoWindowIsOpen(false);
        }}
      ></InfoModal>
      <NewPayeeWindow
        isOpen={addNewPayeeModalisOpen}
        onPayeeCreated={(details: NewPayeeInfo) => {
          const newPayee: Payee = {
            id: details.id,
            accountId: details.accountId,
            categoryId: details.categoryId,
            name: details.payeeName,
            isActive: true,
            accountName: details.accountName,
            numberOfPayments: 0,
            payeeTypeId: details.payeeTypeId,
          };
          onPayeeCreated(newPayee);
          setTimeout(() => {
            setAddNewPayeeModalIsOpen(false);
            setSelectedPayee(newPayee);
          }, 1);
        }}
        onCancel={() => {
          setTimeout(() => {
            setAddNewPayeeModalIsOpen(false);
          }, 500);
        }}
      ></NewPayeeWindow>
    </div>
  );
};
export default PayeeSearcher;
