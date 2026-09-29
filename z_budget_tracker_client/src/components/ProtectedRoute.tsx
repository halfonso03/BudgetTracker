import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../contexts/useAuth';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();

  const auth = useAuth();

  return auth.isLoggedIn() ? (
    <>{children}</>
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
};

// const ProtectedRoute = ({ children }: Props) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   useEffect(() => {
//     if (!user) navigate('/login');
//   }, [navigate, user]);
//   return <>{children}</>;
// };
export default ProtectedRoute;
