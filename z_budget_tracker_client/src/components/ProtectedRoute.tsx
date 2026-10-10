import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useClientAuth from '../contexts/useAuth';
import useUserInfo from '../api/hooks/auth/useUserInfo';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const clientAuth = useClientAuth();

  const { serverUser, serverUserSuccess } = useUserInfo();


  useEffect(() => {
    if (serverUser && serverUserSuccess && !clientAuth.isLoggedIn()) {
      clientAuth.login(serverUser);
      navigate(location.pathname);
      console.log('location', location);
    }
  }, [clientAuth, location, navigate, serverUser, serverUserSuccess]);

  return clientAuth.isLoggedIn() ? (
    <>{children}</>
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
};

export default ProtectedRoute;
