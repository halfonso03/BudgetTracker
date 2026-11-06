import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useClientAuth from '../contexts/useClientAuth';
import useUserInfo from '../api/hooks/auth/useUserInfo';
import toast from 'react-hot-toast';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const clientAuth = useClientAuth();

  const {
    serverUser,
    loadingUserServerInfo,
    serverUserSuccess,
    serverUserError,
  } = useUserInfo();

  useEffect(() => {
    if (serverUser && serverUserSuccess && !clientAuth.isLoggedIn()) {
      clientAuth.login(serverUser);
      // navigate(location.pathname);
      // console.log('location', location);
    }
  }, [clientAuth, location, navigate, serverUser, serverUserSuccess]);

  useEffect(() => {
    if (serverUserError) toast.error(JSON.stringify(serverUserError));
  }, [serverUserError]);

  if (loadingUserServerInfo) return null;

  return clientAuth.isLoggedIn() ? (
    <>{children}</>
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} />
    </>
  );
};

{
  /*  */
}

export default ProtectedRoute;
