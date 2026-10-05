import { PaginationContextProvider } from '../../contexts/pagination/PaginationContextProvider';
import SortingProvider from '../../contexts/SortingContextProvider';
import List from './List';

const PayeeHome = () => {
  return (
    <div>
      <PaginationContextProvider>
        <SortingProvider>
          <List></List>
        </SortingProvider>
      </PaginationContextProvider>
    </div>
  );
};
export default PayeeHome;
