import Skeleton from 'react-loading-skeleton';
import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import { formatCurrency, formatDate } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import SortBySelector from '../../components/SortBySelector';
import { usePagination } from '../../contexts/pagination/usePagination';
import { useSortingContext } from '../../contexts/useSortingContext';
import Spinner from '../../components/Spinner';
import { useEffect } from 'react';

type Props = {
  payeeId: number;
  showSkeleton?: boolean;
  onPaymentRowClicked?: (paymentId: number, payeeId: number) => void;
};
const PayeePaymentsList = ({
  payeeId,
  showSkeleton = true,
  onPaymentRowClicked,
}: Props) => {
  const { data, loadingPayments, loadingPaymentsSuccess } =
    usePayeePayments(payeeId);

  const { setPageNumber } = usePagination();
  const { sortByValue, setSortByValue } = useSortingContext();

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  useEffect(() => {
    setSortByValue('PAYMENTNUMBER');
  }, [setSortByValue]);

  if (loadingPayments && showSkeleton) {
    return (
      <div className="mt-2 ">
        <Skeleton
          height={30}
          width="100%"
          className="mb-1"
          enableAnimation={true}
          count={12}
          containerClassName="flex-1"
        />
      </div>
    );
  } else if (loadingPayments) {
    return <Spinner></Spinner>;
  }

  if (loadingPaymentsSuccess && data?.items.length === 0) {
    return (
      <div className="font-semibold text-neutral-600">
        There are no payments to this payee.
      </div>
    );
  }
  if (!data) return <div>There are no payments</div>;

  return (
    <div className="flex flex-col justify-between  ">
      <div className="border border-neutral-200 ">
        <div
          className="bg-neutral-50 text-neutral-500 border-b border-neutral-200  
            grid grid-cols-[.44fr_.25fr_1fr_.3fr_.7fr_.5fr_.5fr_.5fr_.5fr_.5fr] py-2 gap-4 "
        >
          <div className="pl-3 self-center">
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
              grid grid-cols-[.44fr_.25fr_1fr_.3fr_.7fr_.5fr_.5fr_.5fr_.5fr_.5fr] py-1  gap-4  hover:bg-neutral-100 duration-200 transition-all border-b border-b-neutral-200 last:border-0`}
            >
              <div className="py-1 px-4 self-center text-center ">{p.paymentNumber}</div>
              <div className="py-1 self-center">{p.year}</div>
              <div className="py-1 self-center">{p.initiative}</div>
              <div className="py-1 self-center text-center">{p.grant}</div>
              <div className="py-1 self-center text-center">
                {formatCurrency(p.amount)}
              </div>
              <div className="py-1 self-center text-center">
                {formatDate(p.postedDate)}
              </div>
              <div className="py-1 self-center text-center">{p.postedBy}</div>
              <div className="text-center">{p.invoiceNumber}</div>
              <div className="text-center">
                {p.invoiceDate && formatDate(p.invoiceDate)}
              </div>
              <div className="text-center">{p.checkNumber}</div>
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
