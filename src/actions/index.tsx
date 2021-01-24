import * as AuthActions from './auth';
import * as NotificationActions from './notification';

const Actions = {
  ...AuthActions,
  ...NotificationActions,
  //...AnotherActions,
};

export default Actions;
