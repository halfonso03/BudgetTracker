import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../../App';
import Home from '../../features/Home';
import Budgets from '../../features/Budget/Budgets';
import NotFound from '../../components/NotFound';
import Details from '../../features/Budget/Details';
import CreateBudget from '../../features/Budget/CreateBudget';
import ReprogrammingHome from '../../features/Reprogrammings/ReprogrammingHome';

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
        path: 'reprogramming',
        element: <ReprogrammingHome />,
      },
      {
        path: '/reprogramming/create/:initiativeId?/:grantId?/:accountId?',
        element: <Home />,
      },
    ],
  },
  // { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
