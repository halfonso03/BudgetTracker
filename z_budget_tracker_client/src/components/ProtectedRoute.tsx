import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useClientAuth from '../contexts/useAuth';
import useUserInfo from '../api/hooks/auth/useUserInfo';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();

  const clientAuth = useClientAuth();

  const { serverUser } = useUserInfo();

  if (serverUser && !clientAuth.isLoggedIn()) {
    clientAuth.login(serverUser);
  }

  return clientAuth.isLoggedIn() ? (
    <>{children}</>
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
};

export default ProtectedRoute;
