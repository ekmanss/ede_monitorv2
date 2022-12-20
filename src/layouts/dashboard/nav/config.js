// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  {
    title: 'executor',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'liquidity',
    path: '/dashboard/liquidity',
    icon: icon('ic_user'),
  },
  {
    title: 'ESBT',
    path: '/dashboard/esbtuser',
    icon: icon('ic_user'),
  },
  {
    title: 'vestaker',
    path: '/dashboard/vestaker',
    icon: icon('ic_user'),
  },
  {
    title: 'elpstaker',
    path: '/dashboard/elpstaker',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'counter',
  //   path: '/dashboard/counter',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'query',
  //   path: '/dashboard/query',
  //   icon: icon('ic_user'),
  // }
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
