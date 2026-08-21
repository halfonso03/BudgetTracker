import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../../App';
import Home from '../../features/Home';
import Budgets from '../../features/Budget/Budgets';
import NotFound from '../../components/NotFound';
import Details from '../../features/Budget/Details';
import CreateBudget from '../../features/Budget/CreateBudget';
import ReproMain from '../../features/Reprogrammings/ReproMain';
import ReproLanding from '../../features/Reprogrammings/ReproLanding';
import Search from '../../features/Reprogrammings/Search';

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
        path: '/reprogramming',
        element: <ReproLanding></ReproLanding>,
        children: [
          {
            path: '',
            element: <ReproMain />,
          },
          {
            path: ':id',
            element: <ReproMain />,
          },
          {
            path: 'search',
            element: <Search />,
          },
        ],
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
