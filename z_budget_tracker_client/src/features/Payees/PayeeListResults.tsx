import { Check, X, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber, formatDate } from '../../app/util';
import SearchTermMarker from '../../components/SearchTermMarker';
import { usePagination } from '../../contexts/pagination/usePagination';
import { Pagination } from '../../components/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Props = {
  openPayeeDetails: (payee: Payee) => void;
  data: Payee[];
  loadingPayees: boolean;
};
const PayeeListResults = ({ loadingPayees, data, openPayeeDetails }: Props) => {
  const { searchTerm } = usePagination();

  if (loadingPayees)
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
  if (!data) return null;

  return (
    <div>
      <div className="border-l border-r border-b border-neutral-300/60">
        {data.map((v) => (
          <div
            className=" grid grid-cols-[.7fr_.4fr_1fr_.6fr_.4fr_.35fr_.4fr_.2fr_.2fr] 
          gap-2 p-1 items-center hover:bg-neutral-100 duration-200 transition-all 
          cursor-pointer border-b border-b-neutral-300/60 last:border-0 "
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
    </div>
  );
};
export default PayeeListResults;
