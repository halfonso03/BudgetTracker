import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect, useState } from 'react';
import PayeeDetailsWindow from './PayeeDetailsWindow';
import PayeeListColumHeaders from './PayeeListColumHeaders';
import PayeeListResults from './PayeeListResults';
import PayeeListHeaderControls from './PayeeListHeaderControls';
import { usePagination } from '../../contexts/pagination/usePagination';
import { usePayees } from '../../api/hooks/payees/usePayees';
import { Pagination } from '../../components/Pagination';
import Skeleton from 'react-loading-skeleton';
import YearFilterModal from './modals/YearFilterModal';

const PayeeList = () => {
  const { setPageNumber, setSearchTerm, searchTerm } = usePagination();
  const { setSortByValue } = useSortingContext();
  const [year, setYear] = useState(0);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const { data, loadingPayees } = usePayees(searchTerm, year);
  const [yearFilterModalIsOpen, setYearFilterModalIsOpen] = useState(false);

  useEffect(() => {
    setSortByValue('NAME');
  }, [setSortByValue]);

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

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
      numberOfPayments: 0,
    });
  }

  function handleOpenYearFilterModal() {
    setYearFilterModalIsOpen(true);
  }

  function handleYearSelected(year: number) {
    setYear(year);
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
      <PayeeListHeaderControls
        onSearch={handleSearch}
        onAddPayee={onAddPayee}
      ></PayeeListHeaderControls>
      <PayeeListColumHeaders
        year={year}
        onOpenYearFilterModal={handleOpenYearFilterModal}
      ></PayeeListColumHeaders>
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

      <YearFilterModal
        isOpen={yearFilterModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setYearFilterModalIsOpen(false);
          }, 500);
        }}
        onYearSelected={handleYearSelected}
      ></YearFilterModal>
    </div>
  );
};
export default PayeeList;
