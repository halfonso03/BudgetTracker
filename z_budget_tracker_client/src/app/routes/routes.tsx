import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../../App';
import Home from '../../features/Home';
import Budgets from '../../features/Budget/Budgets';
import Reprogrammings from '../../features/Reprogrammings/Reprogrammings';
import NotFound from '../../components/NotFound';
import Details from '../../features/Budget/Details';
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
        path: '/budget',
        element: <Budgets />,
      },
      {
        path: '/budget/:year/:initiativeId/:grantId',
        element: <Details />,
      },
      {
        path: '/budget/new/:year/:initiativeId/:grantId',
        element: <CreateBudget />,
      },
      {
        path: '/reprogramming/create/:initiativeId?/:grantId?/:accountId?',
        element: <Reprogrammings />,
      },
    ],
  },
  // { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
