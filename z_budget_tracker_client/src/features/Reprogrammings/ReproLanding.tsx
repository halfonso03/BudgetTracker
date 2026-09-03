import { Outlet } from 'react-router-dom';
import { ReproProvider } from '../../contexts/ReproContext';
import SortingProvider from '../../contexts/SortingContextProvider';

const ReproLanding = () => {
  return (
    <div>
      <ReproProvider>
        <SortingProvider>
          <Outlet></Outlet>
        </SortingProvider>
      </ReproProvider>
    </div>
  );
};
export default ReproLanding;
