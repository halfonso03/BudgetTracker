import { Outlet } from 'react-router-dom';
import MenuIdProvider from '../../contexts/MenuIdContext';

const Administration = () => {
  return (
    <MenuIdProvider>
      <Outlet></Outlet>
    </MenuIdProvider>
  );
};
export default Administration;
