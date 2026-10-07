import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import { usePayeesPaymentsStats } from '../../api/hooks/payees/usePayeesPaymentsStats';
import { formatCurrency, formatDate } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import SortBySelector from '../../components/SortBySelector';
import Spinner from '../../components/Spinner';
import { usePagination } from '../../contexts/pagination/usePagination';
import { useSortingContext } from '../../contexts/useSortingContext';

type Props = {
  payeeId: number;
};
const PayeePaymentsList = ({ payeeId }: Props) => {
  const { payments, loadingPayments } = usePayeePayments(payeeId);
  const { paymentStats, loadingPaymentStats } = usePayeesPaymentsStats(payeeId);

  const { setPageNumber } = usePagination();
  const { sortByValue } = useSortingContext();
  // const [sortInitialSet, setSortInitialSet] = useState<boolean>(false);

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

  if (!payments || loadingPayments) return null;

  return (
    <div>
      <div>
        <div className="font-semibold text-neutral-500  border-b border-b-neutral-300 pl-0 p-1 mb-9">
          Payments
        </div>
      </div>
      {payments && payments.payments.length === 0 && (
        <div className="font-semibold text-neutral-600">
          There are no payments to this payee.
        </div>
      )}
      <div className="mb-9 gap-4 w-full ">
        {loadingPaymentStats && (
          <div className="mb-1">
            <Spinner></Spinner>
          </div>
        )}
        {paymentStats && paymentStats.lastPaymentDate && (
          <div className="border-b border-b-neutral-200 grid grid-cols-[1.3fr_1fr_.5fr_1fr_.5fr_1fr_.5fr_1fr] gap-2">
            <div className="text-neutral-400 font-medium ">Last Payment Date</div>
            <div className="text-neutral-800 font-medium">
              {paymentStats.lastPaymentDate
                ? formatDate(paymentStats!.lastPaymentDate!)
                : '-'}
            </div>

            <div className="text-neutral-400 font-medium">Average</div>
            <div className="text-neutral-800 text-center font-medium">
              {paymentStats.averagePayment
                ? formatCurrency(paymentStats!.averagePayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">Smallest</div>
            <div className=" text-neutral-800 text-center font-medium">
              {paymentStats.lowestPayment
                ? formatCurrency(paymentStats!.lowestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">Largest</div>
            <div className="text-neutral-800 text-center font-medium">
              {paymentStats.highestPayment
                ? formatCurrency(paymentStats!.highestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-400 font-medium">Last Payment Amount</div>
            <div className="text-neutral-800 font-medium">
              {paymentStats.lastPaymentAmount
                ? formatCurrency(paymentStats!.lastPaymentAmount!)
                : '-'}
            </div>
          </div>
        )}
      </div>

      {payments && payments.payments.length > 0 && (
        <div className="flex flex-col justify-between  border border-neutral-200 rounded-lg">
          <div>
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
        </div>
      )}

      {payments && payments.payments.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-2 text-sm text-neutral-500">
          <span>
            Showing page{' '}
            <span className="font-medium text-neutral-900">
              {payments?.pagination?.currentPage}
            </span>{' '}
            of {payments?.pagination?.totalPages}
          </span>

          <div className="flex">
            <button
              onClick={() =>
                setPageNumber(
                  Math.max(payments!.pagination!.currentPage - 1, 1),
                )
              }
              disabled={payments?.pagination?.currentPage === 1}
              className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} className="cursor-pointer" />
            </button>

            <Pagination
              data={payments?.pagination}
              onPageNumberChange={handlePageNumberChange}
            ></Pagination>
            <button
              onClick={() =>
                setPageNumber(payments!.pagination!.currentPage + 1)
              }
              disabled={
                payments?.pagination?.currentPage ===
                payments?.pagination?.totalPages
              }
              className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={20} className="cursor-pointer" />
            </button>
          </div>
        </div>
      )}

      {/* {payments &&
        payments?.pagination &&
        payments?.pagination?.totalCount > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              data={payments?.pagination}
              onPageNumberChange={handlePageNumberChange}
            ></Pagination>
          </div>
        )} */}
    </div>
  );
};
export default PayeePaymentsList;
