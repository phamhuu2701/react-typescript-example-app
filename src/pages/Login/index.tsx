import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import AuthApi from '../../apis/auth';
import { RootState } from '../../reducers';
import { AuthState } from '../../types/auth';
import { formValidate } from '../../utils/formValidate';
import { USER_TOKEN } from '../../utils/localStorage';
import { History } from 'history';
import { Button, Grid, TextField, Typography, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { CONFIG } from '../../config';

interface FormData {
  username: { value: string, errMsg: string },
  password: { value: string, errMsg: string },
}

interface Props {
  history: History,
  auth: AuthState,
  actions: typeof Actions
}

interface State {
  formData: FormData | any,
  loginFacebook: boolean,
}

function mapStateToProps(state: RootState) {
  return {

  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}


class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      formData: {
        username: { value: 'admin@gmail.com', errMsg: '' },
        password: { value: '123123123', errMsg: '' },
      },
      loginFacebook: false
    }
  }
  handleChange = (key = '', value = '', errMsg = '') => {
    const { formData } = this.state;
    if (formData[key]) {
      let _formData = JSON.parse(JSON.stringify(formData));
      _formData[key].value = value;
      _formData[key].errMsg = errMsg;
      this.setState({ formData: _formData });
    }
  };
  handleSubmit = async () => {
    const { actions, history } = this.props;
    const { formData } = this.state;
    const { username, password } = formData;

    let _formData = JSON.parse(JSON.stringify(formData));

    let formValid = true;
    let data: any = {};

    const usernameValid = formValidate(username.value, { required: true });
    if (usernameValid.success) {
      data.username = username.value;
    } else {
      formValid = false;
      _formData.username.errMsg = usernameValid.error.message;
    }
    const passwordValid = formValidate(password.value, { required: true, minlength: 8 });
    if (passwordValid.success) {
      data.password = password.value;
    } else {
      formValid = false;
      _formData.password.errMsg = passwordValid.error.message;
    }

    if (formValid) {
      const res = await AuthApi.login(data);
      if (res.success) {
        actions.changeAuthAction({
          user: res.payload.user,
          token: res.payload.token,
          logged: true,
        });
        USER_TOKEN.set(res.payload.token);
        return history.push('/');
      } else {
        actions.showNotificationAction({
          show: true,
          variant: 'error',
          content: res.error.message,
        });
        actions.changeAuthAction({
          user: {},
          token: '',
          logged: false,
        });
        USER_TOKEN.delete();
      }
    } else {
      this.setState({ formData: _formData });
      actions.showNotificationAction({
        show: true,
        variant: 'error',
        content: 'INVALID_FORM_DATA',
      });
    }
  };
  handleLoginFacebookResponse = async (response: object | any) => {
    if (response.status !== 'unknown') {
      const { actions, history } = this.props;
      let res = await AuthApi.loginFacebook({ fb: JSON.stringify(response) });
      if (res.success) {
        actions.changeAuthAction({
          user: res.payload.user,
          token: res.payload.token,
          logged: true,
        });
        USER_TOKEN.set(res.payload.token);
        return history.push('/');
      } else {
        actions.showNotificationAction({
          show: true,
          variant: 'error',
          content: res.error.message,
        });
        actions.changeAuthAction({
          user: {},
          token: '',
          logged: false,
        });
        USER_TOKEN.delete();
      }
    }
  };
  handleGoogleLoginSuccess = async (response: object) => {
    const { actions, history } = this.props;
    let res = await AuthApi.loginGoogle({ gg: JSON.stringify(response) });
    if (res.success) {
      actions.changeAuthAction({
        user: res.payload.user,
        token: res.payload.token,
        logged: true,
      });
      USER_TOKEN.set(res.payload.token);
      return history.push('/');
    } else {
      actions.showNotificationAction({
        show: true,
        variant: 'error',
        content: res.error.message,
      });
      actions.changeAuthAction({
        user: {},
        token: '',
        logged: false,
      });
      USER_TOKEN.delete();
    }
  };
  render() {
    const { formData, loginFacebook } = this.state;
    const { username, password } = formData
    return (
      <div className="auth-page">
        <Grid container justify="center">
          <Grid item sm={8} md={6} lg={4}>
            <Paper>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h4" align="center" className="page-title">
                    <b>LOGIN</b>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="Username *"
                    value={username.value}
                    onChange={(e) => this.handleChange('username', e.target.value)}
                    error={Boolean(username.errMsg)}
                    helperText={username.errMsg}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="Password *"
                    type="password"
                    value={password.value}
                    onChange={(e) => this.handleChange('password', e.target.value)}
                    error={Boolean(password.errMsg)}
                    helperText={password.errMsg}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => this.handleSubmit()}
                  >
                    LOGIN
                </Button>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => this.setState({ loginFacebook: true })}
                      >
                        FACEBOOK
                    </Button>

                      <div className="hidden-block">
                        {loginFacebook && (
                          <FacebookLogin
                            appId={`${CONFIG.FACEBOOK_APP_ID}`}
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={(res) =>
                              this.handleLoginFacebookResponse(res)
                            }
                          />
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <GoogleLogin
                        clientId={`${CONFIG.GOOGLE_CLIENT_ID}`}
                        render={(renderProps) => (
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={renderProps.onClick}
                          >
                            GOOGLE
                          </Button>
                        )}
                        onSuccess={this.handleGoogleLoginSuccess}
                        cookiePolicy={'single_host_origin'}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" spacing={1}>
                    <Grid item>
                      <Link to="/">
                        <p>Forgot password?</p>
                      </Link>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={1}>
                        <Grid item>
                          <p>Don't have an account?</p>
                        </Grid>
                        <Grid item>
                          <Link to="/register">
                            <p><b>REGISTER</b></p>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);