import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect, useState } from 'react';
import PayeeDetailsWindow from './PayeeDetailsWindow';
import PayeeListColumHeaders from './PayeeListColumHeaders';
import PayeeListResults from './PayeeListResults';
import PayeeListHeader from './PayeeListHeader';
import { usePagination } from '../../contexts/pagination/usePagination';
import { usePayees } from '../../api/hooks/payees/usePayees';
import { Pagination } from '../../components/Pagination';
import Skeleton from 'react-loading-skeleton';

const PayeeList = () => {
  const { setPageNumber, setSearchTerm, searchTerm } = usePagination();
  const { setSortByValue } = useSortingContext();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const { data, loadingPayees } = usePayees(searchTerm);

  useEffect(() => {
    setSortByValue('NAME');
  }, [setSortByValue]);

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }
  // const [addPayeeIsOpen, setAddPayeeIsOpen] = useState(false);
  // const [animateOut, setAnimateOut] = useState<boolean>(false);

  // const paginationData = data?.pagination;
  // console.log('paginationData', paginationData);
  // const [vendorsState, setPayeesState] = useState<Payee[] | undefined>(
  //   vendors,
  // );

  function handleDetailsClose() {
    setDetailsOpen(false);
  }

  function handleOpenPayeeDetails(vendor: Payee) {
    setSelectedPayee(vendor);
    setDetailsOpen(true);
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

  const skeleton = () => (
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

  return (
    <div>
      <PayeeListHeader
        onSearch={handleSearch}
        onAddPayee={onAddPayee}
      ></PayeeListHeader>

      <PayeeListColumHeaders></PayeeListColumHeaders>
      {data?.payees ? (
        <PayeeListResults
          openPayeeDetails={handleOpenPayeeDetails}
          data={data?.payees}
          loadingPayees={loadingPayees}
        ></PayeeListResults>
      ) : (
        skeleton()
      )}
      {data?.pagination && (
        <Pagination
          data={data?.pagination}
          onPageNumberChange={handlePageNumberChange}
        ></Pagination>
      )}

      {detailsOpen && (
        <PayeeDetailsWindow
          payee={selectedPayee!}
          onClose={handleDetailsClose}
        ></PayeeDetailsWindow>
      )}
    </div>
  );
};
export default PayeeList;
