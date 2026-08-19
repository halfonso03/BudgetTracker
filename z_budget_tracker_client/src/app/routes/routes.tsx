import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../../App';
import Home from '../../features/Home';
import Budgets from '../../features/Budget/Budgets';
import NotFound from '../../components/NotFound';
import Details from '../../features/Budget/Details';
import CreateBudget from '../../features/Budget/CreateBudget';
import ReproHome from '../../features/Reprogrammings/ReproHome';
import ReproHome2 from '../../features/Reprogrammings/ReproHome2';

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
        path: 'reprogramming1',
        element: <ReproHome />,
      },
      {
        path: 'reprogramming2',
        element: <ReproHome2 />,
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
