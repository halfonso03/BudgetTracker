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
const PaymentsList = ({ payeeId }: Props) => {
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
        <div className="font-semibold text-neutral-700  border-b border-b-neutral-300 pl-0 p-1 mb-9">
          Payments
        </div>
      </div>
      {payments && payments.payments.length === 0 && (
        <div className="font-semibold text-neutral-600">
          There are no payments to this payee.
        </div>
      )}

      <div className="mb-9  gap-4 w-full ">
        {loadingPaymentStats && (
          <div className="mb-1">
            <Spinner></Spinner>
          </div>
        )}
        {paymentStats && paymentStats.lastPaymentDate && (
          <div className="border-b border-b-neutral-200 grid grid-cols-[1.3fr_1fr_.5fr_1fr_.5fr_1fr_.5fr_1fr]">
            <div className="text-neutral-600 opacity-95">Last Payment Date</div>
            <div className=" text-neutral-800">
              {paymentStats.lastPaymentDate
                ? formatDate(paymentStats!.lastPaymentDate!)
                : '-'}
            </div>

            <div className="text-neutral-600 opacity-95">Average</div>
            <div className="text-neutral-900 text-center">
              {paymentStats.averagePayment
                ? formatCurrency(paymentStats!.averagePayment!)
                : '-'}
            </div>
            <div className="text-neutral-600 opacity-95">Smallest</div>
            <div className=" text-neutral-800 text-center">
              {paymentStats.lowestPayment
                ? formatCurrency(paymentStats!.lowestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-600 opacity-95">Largest</div>
            <div className="text-neutral-800 text-center">
              {paymentStats.highestPayment
                ? formatCurrency(paymentStats!.highestPayment!)
                : '-'}
            </div>
            <div className="text-neutral-600 opacity-95">
              Last Payment Amount
            </div>
            <div className="text-neutral-800">
              {paymentStats.lastPaymentAmount
                ? formatCurrency(paymentStats!.lastPaymentAmount!)
                : '-'}
            </div>
          </div>
        )}
      </div>

      {payments && payments.payments.length > 0 && (
        <div className="flex flex-col justify-between min-h-[50dvh]">
          <div>
            <div className="grid grid-cols-[.15fr_.25fr_1.1fr_.3fr_.7fr_.5fr_.5fr] gap-4 mb-2 border-b border-b-neutral-300 ">
              <div className="font-semibold">
                <SortBySelector
                  label="ID"
                  value="ID"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
              <div className="font-semibold">
                <SortBySelector
                  label="Year"
                  value="YEAR"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
              <div className="font-semibold">
                <SortBySelector
                  label="Initiative"
                  value="INITIATIVE"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
              <div className="font-semibold flex justify-center">
                <SortBySelector
                  label="Award"
                  value="GRANT"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
              <div className="font-semibold flex justify-center">
                <SortBySelector
                  label="Amount"
                  value="AMOUNT"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
              <div className="font-semibold flex justify-center">
                <SortBySelector
                  label="Posted Date"
                  value="POSTEDDATE"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>

              <div className="font-semibold flex justify-center">
                <SortBySelector
                  label="Posted By"
                  value="POSTEDBY"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
            </div>
            {payments.payments.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[.15fr_.25fr_1.1fr_.3fr_.7fr_.5fr_.5fr] gap-4 mb-2"
              >
                <div>{p.id}</div>
                <div>{p.year}</div>
                <div>{p.initiative}</div>
                <div className="text-center">{p.grant}</div>
                <div className="text-center">{formatCurrency(p.amount)}</div>
                <div className="text-center">{formatDate(p.postedDate)}</div>
                <div className="text-center">{p.postedBy}</div>
              </div>
            ))}
          </div>

          {payments &&
            payments?.pagination &&
            payments?.pagination?.totalCount > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  data={payments?.pagination}
                  onPageNumberChange={handlePageNumberChange}
                ></Pagination>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
export default PaymentsList;
