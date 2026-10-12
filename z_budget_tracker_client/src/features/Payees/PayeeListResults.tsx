import { Check, X, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber, formatDate } from '../../app/util';
import SearchTermMarker from '../../components/SearchTermMarker';
import { usePagination } from '../../contexts/pagination/usePagination';
import { usePayees } from '../../api/hooks/payees/usePayees';
import Spinner from '../../components/Spinner';
import { Pagination } from '../../components/Pagination';

type Props = {
  openPayeeDetails: (payee: Payee) => void;
};
const PayeeListResults = ({ openPayeeDetails }: Props) => {
  const { searchTerm, setPageNumber } = usePagination();
  const { data, loadingPayees } = usePayees(searchTerm);

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  if (!data || loadingPayees) return null;

  if (loadingPayees)
    return (
      <div className="flex justify-center  text-center">
        <Spinner></Spinner>
      </div>
    );

  return (
    <div>
      <div className="border-l border-r border-b border-neutral-200">
        {data.payees.map((v) => (
          <div
            className=" grid grid-cols-[.7fr_.4fr_1fr_.6fr_.4fr_.4fr_.5fr_.2fr_.2fr] 
          gap-2 p-1 items-center hover:bg-neutral-100 duration-200 transition-all 
          cursor-pointer border-b border-b-neutral-200 last:border-0 "
            key={v.id}
            onClick={() => {
              openPayeeDetails(v);
            }}
          >
            <div className="px-4 py-1 font-medium text-neutral-900">
              <SearchTermMarker
                textToFind={searchTerm || ''}
                textToDisplay={v.name}
              ></SearchTermMarker>
            </div>
            <div className="px-4 py-1 text-center text-neutral-900">
              <SearchTermMarker
                textToFind={searchTerm || ''}
                textToDisplay={v.payeeType}
              ></SearchTermMarker>
            </div>
            <div className="px-4 py-1 text-neutral-600 text-center">
              <SearchTermMarker
                textToFind={searchTerm || ''}
                textToDisplay={v.accountName}
              ></SearchTermMarker>
            </div>
            <div className="px-4 py-1 text-neutral-500 text-center">
              {v.totalPaid ? formatNumber(v.totalPaid) : '-'}
            </div>
            <div className="px-4 py-1 text-neutral-600 text-center">
              {v.lastPaymentAmount ? formatNumber(v.lastPaymentAmount) : '-'}
            </div>
            <div className="px-4 py-1 text-neutral-600 text-center">
              {v.lastPaymentDate ? formatDate(v.lastPaymentDate) : '-'}
            </div>

            <div className="px-4 py-1 text-neutral-600 text-center ">
              {v.daysSinceLastPayment || '-'}
            </div>
            <div className="flex justify-center ">
              {v.isActive ? (
                <Check className="text-green-600"></Check>
              ) : (
                <X className="text-neutral-400"></X>
              )}
            </div>

            <div className="flex justify-center font-semibold">
              <Link to="/test">
                <DollarSign
                  className={`${!v.isActive ? 'text-neutral-400' : 'text-blue-500'} cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                ></DollarSign>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 px-2  text-neutral-500">
        <span>
          Showing page{' '}
          <span className="font-medium text-neutral-900">
            {data?.pagination?.currentPage}
          </span>{' '}
          of {data?.pagination?.totalPages}
        </span>
        <div>{data?.pagination?.totalCount} results found.</div>
        {data?.pagination && (
          <div className="flex">
            <button
              onClick={() =>
                setPageNumber(Math.max(data!.pagination!.currentPage - 1, 1))
              }
              disabled={data?.pagination?.currentPage === 1}
              className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} className="cursor-pointer" />
            </button>
            <Pagination
              data={data?.pagination}
              onPageNumberChange={handlePageNumberChange}
            ></Pagination>
            <button
              onClick={() => setPageNumber(data!.pagination!.currentPage + 1)}
              disabled={
                data?.pagination?.currentPage === data?.pagination?.totalPages
              }
              className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={20} className="cursor-pointer" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PayeeListResults;
