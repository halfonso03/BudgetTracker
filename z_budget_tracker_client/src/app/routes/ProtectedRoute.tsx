// import { Navigate, useLocation } from 'react-router';
// import useAuth from '../../contexts/useAuth';

// type Props = { children: React.ReactNode };

// const ProtectedRoute = ({ children }: Props) => {
//   const location = useLocation();

//   const auth = useAuth();

//   return auth.isLoggedIn() ? (
//     <>{children}</>
//   ) : (
//     <>
//       <Navigate to="/login" state={{ from: location }} replace />
//     </>
//   );
// };

// export default ProtectedRoute;
