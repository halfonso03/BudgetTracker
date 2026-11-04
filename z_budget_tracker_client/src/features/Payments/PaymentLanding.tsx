import { Outlet } from 'react-router-dom';
import SortingProvider from '../../contexts/SortingContextProvider';
import { PaginationContextProvider } from '../../contexts/pagination/PaginationContextProvider';

const PaymentLanding = () => {
  // ReproProvider is not used anywhere
  return (
    <div>
      <PaginationContextProvider>
        <SortingProvider defaultSortOrder="ID">
          <Outlet></Outlet>
        </SortingProvider>
      </PaginationContextProvider>
    </div>
  );
};
export default PaymentLanding;
