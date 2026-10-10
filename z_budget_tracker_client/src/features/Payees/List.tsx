import { Check, ChevronLeft, ChevronRight, DollarSign, X } from 'lucide-react';
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
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import SearchTermMarker from '../../components/SearchTermMarker';

// type Props = {
//   vendors: Payee[];
// };

const List = () => {
  const { data, loadingPayees } = usePayees();
  const { setPageNumber, setSearchTerm, searchTerm } = usePagination();
  const { sortByValue, setSortByValue } = useSortingContext();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  // const [addPayeeIsOpen, setAddPayeeIsOpen] = useState(false);
  // const [animateOut, setAnimateOut] = useState<boolean>(false);

  // const paginationData = data?.pagination;
  // console.log('paginationData', paginationData);
  // const [vendorsState, setPayeesState] = useState<Payee[] | undefined>(
  //   vendors,
  // );

  console.log('searchTerm', searchTerm);

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

  // function handleCloseAddPayeeModal() {
  //   setTimeout(() => {
  //     setAddPayeeIsOpen(false);
  //   }, 450);
  // }

  function onAddPayee() {
    setDetailsOpen(true);
    setSelectedPayee({
      id: 0,
      name: '',
      additionalInformation: '',
      accountName: '',
      isActive: true,
      payeeTypeId: 0,
      accountId: 0,
      categoryId: 0,
    });
  }



  return (
    <div className="mx-auto w-[95%]">
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <div className="flex justify-between w-full">
        <div className="w-full justify-between flex ">
          <Button buttonSize="medium" variation="primary" onClick={onAddPayee}>
            Add Payee
          </Button>
          <Search
            onSearch={(searchTerm: string) => handleSearch(searchTerm)}
          ></Search>
        </div>
      </div>
      {loadingPayees ? (
        <div className="">
          <div className="flex justify-center  text-center">
            <Spinner></Spinner>
          </div>
        </div>
      ) : (
        <>
          <input type="text" />
          <div>
            <div className="flex flex-col justify-between border border-neutral-200 rounded-lg">
              <div
                className="grid grid-cols-[.7fr_.4fr_1fr_.6fr_.4fr_.4fr_.5fr_.2fr_.2fr] gap-2 
                        bg-neutral-50 text-neutral-500 border-b border-neutral-200"
              >
                <div className="flex justify-start  pl-6">
                  <SortBySelector
                    label="Name"
                    value="NAME"
                    currentSortValue={sortByValue}
                  ></SortBySelector>
                </div>
                <div className="flex justify-start pl-6">
                  <SortBySelector
                    label="Type"
                    value="PAYEETYPE"
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
                <div className="flex justify-center">
                  <SortBySelector
                    label="Active"
                    value="ACTIVE"
                    currentSortValue={sortByValue}
                  ></SortBySelector>
                </div>
                <div className="text-center self-center font-semibold">Pay</div>
              </div>
              <div className="">
                {data?.payees?.map((v) => (
                  <div
                    className=" grid grid-cols-[.7fr_.4fr_1fr_.6fr_.4fr_.4fr_.5fr_.2fr_.2fr] gap-2 p-1 items-center hover:bg-neutral-100 duration-200 transition-all cursor-pointer border-b border-b-neutral-200 last:border-0 "
                    key={v.id}
                    onClick={() => {
                      openDetails(v);
                    }}
                  >
                    <div className="px-4 py-1 font-medium text-neutral-900">
                      <SearchTermMarker
                        textToFind={searchTerm || ''}
                        textToDisplay={v.name}
                      ></SearchTermMarker>
                    </div>
                    <div className="px-4 py-1 font-medium text-neutral-900">
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
                      {v.lastPaymentAmount
                        ? formatNumber(v.lastPaymentAmount)
                        : '-'}
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
                      setPageNumber(
                        Math.max(data!.pagination!.currentPage - 1, 1),
                      )
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
                    onClick={() =>
                      setPageNumber(data!.pagination!.currentPage + 1)
                    }
                    disabled={
                      data?.pagination?.currentPage ===
                      data?.pagination?.totalPages
                    }
                    className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={20} className="cursor-pointer" />
                  </button>
                </div>
              )}
            </div>
            {detailsOpen && (
              <PayeeDetailsWindow
                payee={selectedPayee!}
                onClose={handleDetailsClose}
              ></PayeeDetailsWindow>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default List;
