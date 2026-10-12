import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';

const PayeeListColumHeaders = () => {
  const { sortByValue } = useSortingContext();

  return (
    <div
      className="grid grid-cols-[.7fr_.4fr_1fr_.6fr_.4fr_.4fr_.5fr_.2fr_.2fr] gap-2 
                        bg-neutral-100 text-neutral-500 border border-neutral-200 rounded-t-sm "
    >
      <div className="flex justify-start  pl-6">
        <SortBySelector
          label="Name"
          value="NAME"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex justify-center ">
        <SortBySelector
          label="Type"
          value="PAYEETYPE"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex justify-center">
        <SortBySelector
          label="Charge Account"
          value="ACCOUNT"
          currentSortValue={sortByValue}
        ></SortBySelector>
      </div>
      <div className="flex justify-center">
        <SortBySelector
          label="Total Paid"
          value="TOTALPAID"
          currentSortValue={sortByValue}
        ></SortBySelector>
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
      <div className="text-center self-center font-semibold">Pay</div>
    </div>
  );
};
export default PayeeListColumHeaders;
