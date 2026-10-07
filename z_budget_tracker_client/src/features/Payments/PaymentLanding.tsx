import { Outlet } from 'react-router-dom';
import SortingProvider from '../../contexts/SortingContextProvider';

const PaymentLanding = () => {

  // ReproProvider is not used anywhere
  return (
    <div>
        <SortingProvider>
          <Outlet></Outlet>
        </SortingProvider>
    </div>
  );
};
export default PaymentLanding;
