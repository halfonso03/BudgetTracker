import { Filter } from 'lucide-react';
import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';

type Props = {
  onOpenYearFilterModal: () => void;
  year: number;
};

const PayeeListColumHeaders = ({ year, onOpenYearFilterModal }: Props) => {
  const { sortByValue } = useSortingContext();

  return (
    <div
      className="grid grid-cols-[.6fr_.3fr_1fr_.6fr_.4fr_.35fr_.4fr_.2fr] gap-2 
                        bg-gray-50 text-neutral-500 border border-neutral-300/60 dark:border-slate-700/80  rounded-t-md  dark:bg-slate-800/80 py-1"
    >
      <div className="flex items-center justify-start px-4">
        <SortBySelector
          label="Name"
          value="NAME"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex items-center justify-center ">
        <div className="flex justify-center">
          <SortBySelector
            label="Type"
            value="PAYEETYPE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex justify-center">
          <SortBySelector
            label="Charge Account"
            value="ACCOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
      </div>
      <div className="flex items-center flex-col justify-center ">
        <div className="flex justify-center items-center gap-1">
          <SortBySelector
            label="Total Paid"
            value="TOTALPAID"
            currentSortValue={sortByValue}
          ></SortBySelector>
          <Filter
            size={18}
            className={`cursor-pointer  ${year !== 0 ? 'text-blue-500 dark:text-indigo-500' : 'text-neutral-500 dark:text-slate-400'}`}
            onClick={onOpenYearFilterModal}
          ></Filter>
        </div>
        {year !== 0 && (
          <div className="self-center italic text-[.9rem] text-blue-500 dark:text-indigo-500">
            FY {year}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <SortBySelector
          label="Last Payment Amount"
          value="LASTPAYMENTAMOUNT"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex justify-center">
        <SortBySelector
          label="Last Payment Date"
          value="LASTPAYMENTDATE"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex justify-center">
        <SortBySelector
          label="Days Since Last Payment"
          value="DAYSSINCELASTPAYMENT"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex justify-center">
        <SortBySelector
          label="Active"
          value="ACTIVE"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      {/* <div className="text-center self-center font-semibold">Pay</div> */}
    </div>
  );
};
export default PayeeListColumHeaders;
