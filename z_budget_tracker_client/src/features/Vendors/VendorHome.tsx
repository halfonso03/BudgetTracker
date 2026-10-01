import { PaginationContextProvider } from '../../contexts/pagination/PaginationContextProvider';
import List from './List';

const VendorHome = () => {
  return (
    <div>
      <PaginationContextProvider>
        <List></List>
      </PaginationContextProvider>
    </div>
  );
};
export default VendorHome;
