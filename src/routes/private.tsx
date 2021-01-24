import Home from '../pages/Home';
import Profile from '../pages/Profile';

export default [
  {
    path: '/home',
    exact: false,
    name: 'home',
    icon: null,
    component: Home,
    variant: 'user',
    children: [],
  },
  {
    path: '/profile',
    exact: false,
    name: 'profile',
    icon: null,
    component: Profile,
    variant: 'user',
    children: [],
  },
];