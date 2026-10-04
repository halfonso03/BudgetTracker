import { usePayeePayments } from '../../api/hooks/payees/usePayeePayments';
import { formatCurrency, formatDate } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import { usePagination } from '../../contexts/pagination/usePagination';

type Props = {
  payeeId: number;
};
const PaymentsList = ({ payeeId }: Props) => {
  const { payments, loadingPayments } = usePayeePayments(payeeId);
  const { setPageNumber, setSearchTerm } = usePagination();
  // const { sortByValue, setSortByValue } = useSortingContext();

  console.log('payments', payments);
  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  if (!payments || loadingPayments) return null;
  console.log('payments?.pagination', payments?.pagination);
  return (
    <div>
      <div>
        <div className="font-semibold text-neutral-700 text-xl border-b border-b-neutral-300 pl-0 p-1 mb-3">
          Payments
        </div>
      </div>
      {payments && (
        <div className="flex flex-col justify-between min-h-[66dvh]">
          <div>
            <div className="grid grid-cols-[.125fr_.25fr_1.1fr_.3fr_.7fr_.5fr_.5fr] gap-4 mb-4 ">
              <div className="font-semibold">ID</div>
              <div className="font-semibold">Year</div>
              <div className="font-semibold">Initiative</div>
              <div className="font-semibold text-center">Award</div>
              <div className="font-semibold text-center">Posted Date</div>
              <div className="font-semibold text-center">Amount</div>
              <div className="font-semibold text-center">Posted By</div>
            </div>
            {payments.payments.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[.125fr_.25fr_1.1fr_.3fr_.7fr_.5fr_.5fr] gap-4 mb-2"
              >
                <div>{p.id}</div>
                <div>{p.year}</div>
                <div>{p.initiative}</div>
                <div className="text-center">{p.grant}</div>
                <div className="text-center">{formatDate(p.postedDate)}</div>
                <div className="text-center">{formatCurrency(p.amount)}</div>
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
