import { Grid } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import Preloader from '../../components/Preloader';
import { RootState } from '../../reducers';
import routes from '../../routes';
import { AuthState } from '../../types/auth';
import { NotificationState } from '../../types/notifycation';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { USER_TOKEN } from '../../utils/localStorage';
import AuthApi from '../../apis/auth';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

interface Props {
  store: RootState,
  auth: AuthState,
  notification: NotificationState,
  actions: typeof Actions
}

interface State {
  isReady: boolean,
}

function mapStateToProps(state: RootState) {
  return {
    store: state,
    auth: state.auth,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class AppContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isReady: false,
    }
  }
  checkUserLogged = async () => {
    const { auth, actions } = this.props;
    if (!auth.logged) {
      const userToken = USER_TOKEN.get();
      if (userToken) {
        const res = await AuthApi.getUserByToken();
        if (res.success) {
          actions.changeAuthAction({
            user: res.payload,
            token: userToken,
            logged: true,
          });
        } else {
          actions.changeAuthAction({
            user: {},
            token: '',
            logged: false,
          });
          USER_TOKEN.delete();
        }
      }
    }
    this.setState({ isReady: true });
  };
  componentDidMount() {
    const { actions } = this.props
    console.log('actions :>> ', actions);
    this.checkUserLogged()
  }
  handleCloseNotifycation = () => {
    const { actions } = this.props
    actions.showNotificationAction({ show: false, variant: 'default', content: '' })
  }
  render() {
    const { store, auth, notification } = this.props
    const { isReady } = this.state
    console.log('store :>> ', store);
    return (
      <div>
        <Grid container>
          {auth.logged && (
            <Grid item xs={12}>
              <Header />
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item xs={12}>
                <Grid container>
                  {auth.logged && (
                    <Grid item>
                      <div className="desktop-section">
                        <Sidebar />
                      </div>
                    </Grid>
                  )}
                  <Grid item xs>
                    {isReady
                      ? (
                        <Switch>
                          {routes.auth.length > 0 && routes.auth.map((route: any, index: number) => (
                            <Route
                              key={index}
                              path={route.path}
                              exact={route.exact}
                              component={route.component}
                            />
                          ))}
                          {routes.public.length > 0 && routes.public.map((route: any, index: number) => (
                            <Route
                              key={index}
                              path={route.path}
                              exact={route.exact}
                              component={route.component}
                            />
                          ))}
                          {routes.private.length > 0 && routes.private.map((route: any, index: number) => (
                            <Route
                              key={index}
                              path={route.path}
                              exact={route.exact}
                              component={auth.logged ? route.component : routes.auth[0].component}
                            />
                          ))}
                          <Redirect from="/" to={auth.logged ? routes.private[0].path : routes.auth[0].path} />
                        </Switch>
                      )
                      : (
                        <Preloader />
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {notification.show && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => this.handleCloseNotifycation()}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => this.handleCloseNotifycation()} severity={notification.variant}>
              {notification.content}
            </Alert>
          </Snackbar>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);