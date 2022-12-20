import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import Liquidity from './pages/Liquidity';
import Esbtuser from './pages/Esbtuser';
import Vestaker from  './pages/Vestaker';
import Elpstaker from  './pages/Elpstaker';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import {Counter} from "./features/counter/Counter";
import {ReactQuery} from "./features/reactQuery/ReactQuery";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'liquidity', element: <Liquidity /> },
        { path: 'esbtuser', element: <Esbtuser /> },
        { path: 'vestaker', element: <Vestaker /> },
        { path: 'elpstaker', element: <Elpstaker /> },
        { path: 'counter', element: <Counter /> },
        { path: 'query', element: <ReactQuery /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/user" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
