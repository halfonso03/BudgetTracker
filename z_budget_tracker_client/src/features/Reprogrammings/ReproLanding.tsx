import { Outlet } from 'react-router-dom';
import { ReproProvider } from '../../contexts/ReproContext';

const ReproLanding = () => {
  return (
    <div>
      <ReproProvider>
        <Outlet></Outlet>
      </ReproProvider>
    </div>
  );
};
export default ReproLanding;
