import Skeleton from 'react-loading-skeleton';
import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import { formatCurrency, formatDate } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import SortBySelector from '../../components/SortBySelector';
import { usePagination } from '../../contexts/pagination/usePagination';
import { useSortingContext } from '../../contexts/useSortingContext';
import Spinner from '../../components/Spinner';

type Props = {
  payeeId: number;
  showSkeleton?: boolean;
};
const PayeePaymentsList = ({ payeeId, showSkeleton = true }: Props) => {
  const { payments, loadingPayments, loadingPaymentsSuccess } =
    usePayeePayments(payeeId);

  const { setPageNumber } = usePagination();
  const { sortByValue } = useSortingContext();

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  // useEffect(() => {
  //   if (!sortInitialSet) {
  //     // setSortByValue('ID');
  //     // // eslint-disable-next-line react-hooks/set-state-in-effect
  //     // setSortInitialSet(true);
  //   }
  // }, [setSortByValue, sortInitialSet]);

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
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );
  }

  if (loadingPaymentsSuccess && payments?.payments.length === 0) {
    return (
      <div className="font-semibold text-neutral-600">
        There are no payments to this payee.
      </div>
    );
  }
  if (!payments) return <div>There are no payments</div>;

  return (
    <div className="flex flex-col justify-between  ">
      <div className="border border-neutral-200 rounded-sm rounded-b-none">
        <div
          className="bg-neutral-100 text-neutral-500 border-b border-neutral-200  
            grid grid-cols-[.25fr_.25fr_1.1fr_.3fr_.7fr_.5fr_.5fr] gap-4  "
        >
          <div className="px-4 py-1">
            <SortBySelector
              label="ID"
              value="ID"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" py-1">
            <SortBySelector
              label="Year"
              value="YEAR"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" py-1">
            <SortBySelector
              label="Initiative"
              value="INITIATIVE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center">
            <SortBySelector
              label="Award"
              value="GRANT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center">
            <SortBySelector
              label="Amount"
              value="AMOUNT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
          <div className=" flex justify-center">
            <SortBySelector
              label="Posted Date"
              value="POSTEDDATE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>

          <div className=" flex justify-center">
            <SortBySelector
              label="Posted By"
              value="POSTEDBY"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>

        <div>
          {payments.payments.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[.25fr_.25fr_1.1fr_.3fr_.7fr_.5fr_.5fr]  gap-4  hover:bg-neutral-100 duration-200 transition-all cursor-pointer border-b border-b-neutral-200 last:border-0"
            >
              <div className="py-2 px-4 ">{p.id}</div>
              <div className="py-2 ">{p.year}</div>
              <div className="py-2 ">{p.initiative}</div>
              <div className="  py-2  text-center">{p.grant}</div>
              <div className=" py-2  text-center">
                {formatCurrency(p.amount)}
              </div>
              <div className="py-2  text-center">
                {formatDate(p.postedDate)}
              </div>
              <div className="  py-2  text-center">{p.postedBy}</div>
            </div>
          ))}
        </div>
      </div>

      {payments?.pagination && (
        <Pagination
          data={payments?.pagination}
          onPageNumberChange={handlePageNumberChange}
        ></Pagination>
      )}
    </div>
  );
};
export default PayeePaymentsList;
