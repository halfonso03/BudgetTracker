import { PaginationContextProvider } from '../../contexts/pagination/PaginationContextProvider';
import SortingProvider from '../../contexts/SortingContextProvider';
import PayeeList from './PayeeList';

const PayeeHome = () => {
  return (
    <PaginationContextProvider>
      <SortingProvider defaultSortOrder='ID'>
        <PayeeList></PayeeList>
      </SortingProvider>
    </PaginationContextProvider>
  );
};
export default PayeeHome;
