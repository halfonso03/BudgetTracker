import { useEffect } from 'react';
import useLogout from '../../api/hooks/auth/useLogout';

const Logout = () => {
  const { logoutUser } = useLogout();

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);
  return (
    <div>
      {/* <Button
        key={loggedOut.toString()}
        className="nav-link cursor-pointer self-end"
        onClick={() => {}}
      >
        Log Out
      </Button> */}
    </div>
  );
};
export default Logout;
