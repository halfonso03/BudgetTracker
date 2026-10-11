import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect, useState } from 'react';
import PayeeDetailsWindow from './PayeeDetailsWindow';
import PayeeListColumHeaders from './PayeeListColumHeaders';
import PayeeListResults from './PayeeListResults';
import PayeeListHeader from './PayeeListHeader';
import { usePagination } from '../../contexts/pagination/usePagination';


const List = () => {
  const { setPageNumber, setSearchTerm, searchTerm } = usePagination();
  const { setSortByValue } = useSortingContext();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);

  // const [addPayeeIsOpen, setAddPayeeIsOpen] = useState(false);
  // const [animateOut, setAnimateOut] = useState<boolean>(false);

  // const paginationData = data?.pagination;
  // console.log('paginationData', paginationData);
  // const [vendorsState, setPayeesState] = useState<Payee[] | undefined>(
  //   vendors,
  // );

  function handleOpenPayeeDetails(vendor: Payee) {
    setSelectedPayee(vendor);
    setDetailsOpen(true);
  }

  useEffect(() => {
    setSortByValue('NAME');
  }, [setSortByValue]);

  // function handlePageNumberChange(pageNumber: number) {
  //   setPageNumber(pageNumber);
  // }

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
      {searchTerm}
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <PayeeListHeader
        onSearch={handleSearch}
        onAddPayee={onAddPayee}
      ></PayeeListHeader>

      <div>
        {/* <input type="text" /> */}
        <div className="flex flex-col justify-between border border-neutral-200 rounded-lg">
          <PayeeListColumHeaders></PayeeListColumHeaders>
          <PayeeListResults
            openPayeeDetails={handleOpenPayeeDetails}
          ></PayeeListResults>
        </div>
        {/* <div className="flex items-center justify-between mt-6 px-2  text-neutral-500">
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
          </div>*/}
        {detailsOpen && (
          <PayeeDetailsWindow
            payee={selectedPayee!}
            onClose={handleDetailsClose}
          ></PayeeDetailsWindow>
        )}
      </div>
    </div>
  );
};
export default List;
