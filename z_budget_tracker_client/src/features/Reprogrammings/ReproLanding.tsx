import { Outlet } from 'react-router-dom';
import { ReproProvider } from '../../contexts/ReproContext';
import SortingProvider from '../../contexts/SortingContextProvider';
import { PaginationContextProvider } from '../../contexts/pagination/PaginationContextProvider';

const ReproLanding = () => {
  console.log('ReproLanding render');

  return (
    <div>
      <ReproProvider>
        <PaginationContextProvider>
          <SortingProvider>
            <Outlet></Outlet>
          </SortingProvider>
        </PaginationContextProvider>
      </ReproProvider>
    </div>
  );
};
export default ReproLanding;
