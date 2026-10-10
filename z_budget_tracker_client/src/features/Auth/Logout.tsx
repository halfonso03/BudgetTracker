import { useEffect } from 'react';
import useLogout from '../../api/hooks/auth/useLogout';

const Logout = () => {
  const { logoutUser } = useLogout();

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return null;
};
export default Logout;
