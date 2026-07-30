import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../../App';
import Home from '../../features/Home';
import Budgets from '../../features/Budget/Budgets';
import Reprogrammings from '../../features/Reprogrammings/Reprogrammings';
import NotFound from '../../components/NotFound';
import Budget from '../../features/Budget/Budget';
import CreateBudget from '../../features/Budget/CreateBudget';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: '/budgets',
        element: <Budgets />,
      },
      {
        path: '/budgets/:initiativeId/:grantId',
        element: <Budget />,
      },
      {
        path: '/budgets/new',
        element: <CreateBudget />,
      },
      {
        path: '/reprogrammings',
        element: <Reprogrammings />,
      },
    ],
  },
  // { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
