import { PaginationContextProvider } from '../../contexts/pagination/PaginationContextProvider';
import SortingProvider from '../../contexts/SortingContextProvider';
import List from './List';

const PayeeHome = () => {
  return (
    <PaginationContextProvider>
      <SortingProvider>
        <List></List>
      </SortingProvider>
    </PaginationContextProvider>
  );
};
export default PayeeHome;
