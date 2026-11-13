import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import { formatCurrency, formatDate } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import SortBySelector from '../../components/SortBySelector';
import { usePagination } from '../../contexts/pagination/usePagination';
import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect } from 'react';

type Props = {
  payeeId: number;
  showSkeleton?: boolean;
  onPaymentRowClicked?: (paymentId: number, payeeId: number) => void;
};
const PayeePaymentsList = ({ payeeId, onPaymentRowClicked }: Props) => {
  const { data, loadingPaymentsSuccess } = usePayeePayments(payeeId);

  const { setPageNumber } = usePagination();
  const { sortByValue, setSortByValue } = useSortingContext();

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  useEffect(() => {
    setSortByValue('PAYMENTNUMBER');
  }, [setSortByValue]);

  // if (loadingPayments && showSkeleton) {
  //   return (
  //     <div className="mt-2 ">
  //       <Spinner></Spinner>

  //     </div>
  //   );
  // } else

  // if (loadingPayments) {
  //   return <Spinner></Spinner>;
  // }

  if (loadingPaymentsSuccess && data?.items.length === 0) {
    return (
      <div className="font-semibold text-neutral-600 dark:text-slate-300">
        There are no payments to this payee.
      </div>
    );
  }
  if (!data) return <div>There are no payments</div>;

  return (
    <div className="flex flex-col justify-between  ">
      <div className="border rounded-md border-neutral-300 dark:border-slate-700/80 ">
        <div
          className="text-neutral-500 bg-neutral-200
               rounded-t-md  dark:bg-slate-800/80 border-b border-b-neutral-300
            grid grid-cols-[.46fr_.25fr_1.2fr_.3fr_.7fr_.5fr_.5fr_.5fr_.5fr_.5fr] py-2 gap-4 dark:border-b-slate-700/80
             "
        >
          <div className="pl-3 self-center  ">
            <SortBySelector
              label="PMT. NO."
              value="PAYMENTNUMBER"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className="  self-center">
            <SortBySelector
              label="YEAR"
              value="YEAR"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className="  self-center">
            <SortBySelector
              label="INITIATIVE"
              value="INITIATIVE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className="  self-center ">
            <SortBySelector
              label="AWARD"
              value="GRANT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center self-center ">
            <SortBySelector
              label="AMOUNT"
              value="AMOUNT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center self-center">
            <SortBySelector
              label="POST DATE"
              value="POSTEDDATE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>

          <div className=" flex justify-center self-center">
            <SortBySelector
              label="POSTED BY"
              value="POSTEDBY"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center self-center">
            <SortBySelector
              label="INVOICE. NO."
              value="INVOICENO"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center self-center">
            <SortBySelector
              label="INV. DATE"
              value="INVOICEDATE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center self-center">
            <SortBySelector
              label="CHECK NO."
              value="CHECKNO"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>

        <div>
          {data.items.map((p, i) => (
            <div
              key={i}
              className={` ${onPaymentRowClicked != null ? 'cursor-pointer ' : ''} 
              grid grid-cols-[.46fr_.25fr_1.2fr_.3fr_.7fr_.5fr_.5fr_.5fr_.5fr_.5fr] py-1  gap-4  hover:bg-neutral-100 dark:hover:bg-slate-700  duration-200 transition-all border-b border-b-neutral-200 dark:border-b-slate-700/80 last:border-0`}
            >
              <div className="py-1 px-4 self-center text-center dark:text-white ">
                {p.paymentNumber}
              </div>
              <div className="py-1 self-center dark:text-white">{p.year}</div>
              <div className="py-1 self-center dark:text-white">
                {p.initiative}
              </div>
              <div className="py-1 self-center text-center dark:text-white">
                {p.grant}
              </div>
              <div className="py-1 self-center text-center dark:text-white">
                {formatCurrency(p.amount)}
              </div>
              <div className="py-1 self-center text-center dark:text-white">
                {formatDate(p.postedDate)}
              </div>
              <div className="py-1 self-center text-center dark:text-white">
                {p.postedBy}
              </div>
              <div className="text-center dark:text-white">
                {p.invoiceNumber}
              </div>
              <div className="text-center dark:text-white ">
                {p.invoiceDate && formatDate(p.invoiceDate)}
              </div>
              <div className="text-center dark:text-white">{p.checkNumber}</div>
            </div>
          ))}
        </div>
      </div>

      {data?.pagination && (
        <Pagination
          data={data?.pagination}
          onPageNumberChange={handlePageNumberChange}
        ></Pagination>
      )}
    </div>
  );
};
export default PayeePaymentsList;
