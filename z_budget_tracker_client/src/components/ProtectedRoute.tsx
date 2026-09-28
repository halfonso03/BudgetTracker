import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);
  return <>{children}</>;
};
export default ProtectedRoute;
