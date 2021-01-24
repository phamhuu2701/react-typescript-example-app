import Login from '../pages/Login';
import Register from '../pages/Register';

export default [
  {
    path: '/login',
    exact: false,
    name: 'login',
    icon: null,
    component: Login,
    variant: 'auth',
    children: [],
  },
  {
    path: '/register',
    exact: false,
    name: 'register',
    icon: null,
    component: Register,
    variant: 'auth',
    children: [],
  },
];