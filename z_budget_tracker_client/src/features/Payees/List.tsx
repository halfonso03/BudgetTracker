import { Check, DollarSign, Pencil, X } from 'lucide-react';
import { formatDate, formatNumber } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import { usePagination } from '../../contexts/pagination/usePagination';
import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect, useState } from 'react';
import PayeeDetailsWindow from './PayeeDetailsWindow';
import Search from '../../components/Search';
import Button from '../../components/Button';
import { usePayees } from '../../api/hooks/payees/usePayees';

// type Props = {
//   vendors: Payee[];
// };

const List = () => {
  const { data, loadingPayees } = usePayees();
  const { setPageNumber, setSearchTerm } = usePagination();
  const { sortByValue, setSortByValue } = useSortingContext();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);

  // const paginationData = data?.pagination;
  // console.log('paginationData', paginationData);
  // const [vendorsState, setPayeesState] = useState<Payee[] | undefined>(
  //   vendors,
  // );

  function openDetails(vendor: Payee) {
    setSelectedPayee(vendor);
    setDetailsOpen(true);
  }

  useEffect(() => {
    setSortByValue('NAME');
  }, [setSortByValue]);

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  function handleDetailsClose() {
    setDetailsOpen(false);
  }
  function handleSearch(searchTerm: string) {
    setSearchTerm(searchTerm);
    setPageNumber(1);
  }
  if (loadingPayees) return null;

  return (
    <div className="mx-auto w-[95%]">
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <div className="flex justify-end w-full mb-4">
        <div className="w-[50%] flex gap-6">
          <Search
            onSearch={(searchTerm: string) => handleSearch(searchTerm)}
          ></Search>
          <Button
            buttonSize="medium"
            variation="secondary"
            additionalclasses="border-neutral-400 text-neutral-700"
          >
            Add Payee
          </Button>
        </div>
      </div>

      <input type="text" />
      <div
        className="mb-2 bg-neutral-100 grid grid-cols-[.9fr_1fr_.6fr_.5fr_.5fr_.6fr_.2fr_.2fr_.2fr] gap-2 p-1  font-semibold text-neutral-700 border-b border-b-neutral-300"
        style={{
          borderRadius: '5px 5px 0 0',
        }}
      >
        <div className="flex justify-start pl-1">
          <SortBySelector
            label="Name"
            value="NAME"
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
        <div className="flex  justify-end">
          <SortBySelector
            label="Active"
            value="ACTIVE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="text-center self-center">Edit</div>
        <div className="text-center self-center">Pay</div>
      </div>
      {data?.vendors?.map((v) => (
        <div
          className="rounded-sm grid grid-cols-[.9fr_1fr_.6fr_.5fr_.5fr_.6fr_.2fr_.2fr_.2fr] gap-2 p-1 items-center hover:bg-neutral-100 duration-200 transition-all cursor-pointer"
          key={v.id}
        >
          <div>{v.name}</div>
          <div className="text-center">{v.accountName}</div>
          <div className="text-center">
            {v.totalPaid ? formatNumber(v.totalPaid) : '-'}
          </div>
          <div className="text-center">
            {v.lastPaymentAmount ? formatNumber(v.lastPaymentAmount) : '-'}
          </div>
          <div className="text-center">
            {v.lastPaymentDate ? formatDate(v.lastPaymentDate) : '-'}
          </div>

          <div className="text-center ">{v.daysSinceLastPayment || '-'}</div>
          <div className="flex justify-center ">
            {v.isActive ? (
              <Check className="text-green-600"></Check>
            ) : (
              <X className="text-red-600"></X>
            )}
          </div>
          <div className="flex justify-center ">
            <Pencil
              className=" text-neutral-600 cursor-pointer"
              onClick={() => {
                openDetails(v);
              }}
            ></Pencil>
          </div>
          <div className="flex justify-center ">
            <DollarSign
              className={`${!v.isActive ? 'text-neutral-400' : 'text-blue-500'} cursor-pointer`}
            ></DollarSign>
          </div>
        </div>
      ))}
      <div
        className="flex justify-center mt-8 bg-neutral-100 py-2 rounded-sm border-t border-t-neutral-300"
        style={{
          borderRadius: '0 0 5px 5px',
        }}
      >
        <Pagination
          data={data?.pagination}
          onPageNumberChange={handlePageNumberChange}
        ></Pagination>
      </div>
      {detailsOpen && (
        <PayeeDetailsWindow
          payee={selectedPayee!}
          onClose={handleDetailsClose}
        ></PayeeDetailsWindow>
      )}
    </div>
  );
};
export default List;
