import { Check, CircleX } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import { formatNumber, formatDate } from '../../app/util';
import SearchTermMarker from '../../components/SearchTermMarker';
import { usePagination } from '../../contexts/pagination/usePagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Props = {
  openPayeeDetails: (payee: Payee) => void;
  data: Payee[];
  loadingPayees: boolean;
};
const PayeeListResults = ({ loadingPayees, data, openPayeeDetails }: Props) => {
  const { searchTerm } = usePagination();

  // const navigate = useNavigate();

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
      <div className="border-l border-r border-b border-neutral-300/60 dark:border-slate-700/80 rounded-b-md">
        {data.map((v) => (
          <div
            className="grid grid-cols-[.6fr_.3fr_1fr_.6fr_.4fr_.35fr_.4fr_.2fr] gap-2 
            items-center py-1  cursor-pointer  last:border-0 transition-all 
            hover:bg-neutral-100 dark:hover:bg-slate-700 border-b border-b-neutral-300/60 dark:border-slate-700/80  "
            key={v.id}
            onClick={() => {
              openPayeeDetails(v);
            }}
          >
            <div className="px-4 py-1 text-neutral-800 dark:text-white ">
              <SearchTermMarker
                textToFind={searchTerm || ''}
                textToDisplay={v.name}
              ></SearchTermMarker>
            </div>
            <div className="px-4 py-1 text-center  text-neutral-800 dark:text-white ">
              <SearchTermMarker
                textToFind={searchTerm || ''}
                textToDisplay={v.payeeType}
              ></SearchTermMarker>
            </div>
            <div className="px-4 py-1 text-center  text-neutral-800 dark:text-white">
              <SearchTermMarker
                textToFind={searchTerm || ''}
                textToDisplay={v.accountName}
              ></SearchTermMarker>
            </div>
            <div className="px-4 py-1 text-center  text-neutral-800 dark:text-white">
              {v.totalPaid ? formatNumber(v.totalPaid) : '-'}
            </div>
            <div className="px-4 py-1 text-center  text-neutral-800 dark:text-white">
              {v.lastPaymentAmount ? formatNumber(v.lastPaymentAmount) : '-'}
            </div>
            <div className="px-4 py-1 text-center  text-neutral-800 dark:text-white">
              {v.lastPaymentDate ? formatDate(v.lastPaymentDate) : '-'}
            </div>

            <div className="px-4 py-1 text-center  text-neutral-800 dark:text-white">
              {v.daysSinceLastPayment || '-'}
            </div>
            <div className="flex justify-center ">
              {v.isActive ? (
                <Check className="text-green-600 dark:text-emerald-400"></Check>
              ) : (
                <CircleX className="text-neutral-500 dark:text-slate-300"></CircleX>
              )}
            </div>

            {/* <div className="flex justify-center font-semibold">
              <Link to="/test">
                <DollarSign
                  onClick={() => {
                    navigate(
                      `/payment/${v.id}/${v.categoryId}/${v.accountId}`,
                    );
                  }}
                ></DollarSign>
              </Link>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default PayeeListResults;
