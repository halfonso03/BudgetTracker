import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect, useState } from 'react';
import PayeeDetailsWindow from './PayeeDetailsWindow';
import PayeeListColumHeaders from './PayeeListColumHeaders';
import PayeeListResults from './PayeeListResults';
import PayeeListHeader from './PayeeListHeader';
import { usePagination } from '../../contexts/pagination/usePagination';

const PayeeList = () => {
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
        <div className="">
          <PayeeListColumHeaders></PayeeListColumHeaders>
          <PayeeListResults
            openPayeeDetails={handleOpenPayeeDetails}
          ></PayeeListResults>
        </div>

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
export default PayeeList;
