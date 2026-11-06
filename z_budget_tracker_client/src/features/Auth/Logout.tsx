import { useEffect } from 'react';
import useLogout from '../../api/hooks/auth/useLogout';
import Spinner from '../../components/Spinner';

const Logout = () => {
  const { logoutUser } = useLogout();

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return (
    <div className="mt-10 flex justify-center">
      <Spinner></Spinner>
    </div>
  );
};
export default Logout;
