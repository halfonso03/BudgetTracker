import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import UsersInOU from '../../features/users/UsersInOU';
import Home from '../../pages/Home';
import Login from '../../features/account/login';
import App from '../../App';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../../components/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/:ou/users',
            element: (
              <ProtectedRoute>
                <UsersInOU></UsersInOU>
              </ProtectedRoute>
            ),
          },
        ],
      },
      { path: '/login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
