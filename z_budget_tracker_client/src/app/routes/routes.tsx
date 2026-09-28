import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../../App';
import Home from '../../features/Home';
import Budgets from '../../features/Budget/Budgets';
import NotFound from '../../components/NotFound';
import Details from '../../features/Budget/Details';
import CreateBudget from '../../features/Budget/CreateBudget';
import ReproLanding from '../../features/Reprogrammings/ReproLanding';
import ReproSearch from '../../features/Reprogrammings/ReproSearch';
import Login from '../../features/Auth/Login';
import ReproPreload from '../../features/Reprogrammings/ReproPreload';
import ReproDetails from '../../features/Reprogrammings/ReproDetails';
import ReproNew from '../../features/Reprogrammings/ReproNew';
import Reports from '../../features/Reports/Reports';
import ProtectedRoute from '../../components/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Home></Home>
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/budget',
        element: (
          <ProtectedRoute>
            <Budgets />
          </ProtectedRoute>
        ),
      },
      {
        path: '/budget/:year/:initiativeId/:grantId',
        element: (
          <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        ),
      },
      {
        path: '/budget/new/:year/:initiativeId/:grantId',
        element: (
          <ProtectedRoute>
            <CreateBudget />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reprogramming',
        element: (
          <ProtectedRoute>
            <ReproLanding></ReproLanding>
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: (
              <ProtectedRoute>
                <ReproNew />
              </ProtectedRoute>
            ),
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <ReproNew />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <ProtectedRoute>
                <ReproDetails />,
              </ProtectedRoute>
            ),
          },
          {
            path: ':year/:initiativeId/:grantId/:categoryId/:accountId',
            element: (
              <ProtectedRoute>
                <ReproPreload></ReproPreload>
              </ProtectedRoute>
            ),
          },
          {
            path: 'search',
            element: (
              <ProtectedRoute>
                <ReproSearch />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '/reprogramming/create/:initiativeId?/:grantId?/:accountId?',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);

// children: [
//         {
//           path: '',
//           element: <ReproMain />,
//         },
//         {
//           path: ':id',
//           element: <ReproMain />,
//         },
//         {
//           path: ':year/:initiativeId/:grantId/:categoryId/:accountId',
//           element: <ReproPreload></ReproPreload>,
//         },
//         {
//           path: 'search',
//           element: <Search />,
//         },
//       ],
