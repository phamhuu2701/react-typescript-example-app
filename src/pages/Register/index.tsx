import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import AuthApi from '../../apis/auth';
import { RootState } from '../../reducers';
import { AuthState } from '../../types/auth';
import { formValidate } from '../../utils/formValidate';
import { History } from 'history';
import { Button, Grid, TextField, Typography, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { CONFIG } from '../../config';
import { USER_TOKEN } from '../../utils/localStorage';

interface FormData {
  firstName: { value: string, errMsg: string },
  lastName: { value: string, errMsg: string },
  email: { value: string, errMsg: string },
  phoneNumber: { value: string, errMsg: string },
  password: { value: string, errMsg: string },
  passwordConfirm: { value: string, errMsg: string },
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


class Register extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      formData: {
        firstName: { value: '', errMsg: '' },
        lastName: { value: '', errMsg: '' },
        email: { value: '', errMsg: '' },
        phoneNumber: { value: '', errMsg: '' },
        password: { value: '', errMsg: '' },
        passwordConfirm: { value: '', errMsg: '' },
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
    const { firstName, lastName, email, phoneNumber, password, passwordConfirm } = formData;

    let _formData = JSON.parse(JSON.stringify(formData));

    let formValid = true;
    let data: any = {};

    const firstNameValid = formValidate(firstName.value, { required: true });
    if (firstNameValid.success) {
      data.firstName = firstName.value;
    } else {
      formValid = false;
      _formData.firstName.errMsg = firstNameValid.error.message;
    }
    const lastNameValid = formValidate(lastName.value, { required: true });
    if (lastNameValid.success) {
      data.lastName = lastName.value;
    } else {
      formValid = false;
      _formData.lastName.errMsg = lastNameValid.error.message;
    }
    const emailValid = formValidate(email.value, { required: true }, 'email');
    if (emailValid.success) {
      data.email = email.value;
    } else {
      formValid = false;
      _formData.email.errMsg = emailValid.error.message;
    }
    if (phoneNumber.value) {
      const phoneNumberValid = formValidate(phoneNumber.value, {}, 'tel');
      if (phoneNumberValid.success) {
        data.phoneNumber = phoneNumber.value;
      } else {
        formValid = false;
        _formData.phoneNumber.errMsg = phoneNumberValid.error.message;
      }
    }
    const passwordValid = formValidate(password.value, { required: true, minlength: 8 });
    if (passwordValid.success) {
      //
    } else {
      formValid = false;
      _formData.password.errMsg = passwordValid.error.message;
    }
    const passwordConfirmValid = formValidate(passwordConfirm.value, {
      required: true,
      minlength: 8,
    });
    if (passwordConfirmValid.success) {
      if (password.value === passwordConfirm.value) {
        data.password = password.value;
      } else {
        formValid = false;
        _formData.passwordConfirm.errMsg = 'PASSWORD_AND_PASSWORD_CONFIRM_DO_NOT_MATCH';
      }
    } else {
      formValid = false;
      _formData.passwordConfirm.errMsg = passwordConfirmValid.error.message;
    }

    if (formValid) {
      const res = await AuthApi.register(data);
      if (res.success) {
        actions.showNotificationAction({
          show: true,
          variant: 'success',
          content: 'ACCOUT_CREATED',
        });
        return history.push('/login');
      } else {
        actions.showNotificationAction({
          show: true,
          variant: 'error',
          content: res.error.message,
        });
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
  handleLoginFacebookResponse = async (response: object) => {
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
    const { firstName, lastName, email, phoneNumber, password, passwordConfirm } = formData;
    return (
      <div className="auth-page">
        <Grid container justify="center">
          <Grid item sm={8} md={6} lg={4}>
            <Paper elevation={0}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" align="center" className="page-title">
                    <b>SIGN UP</b>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="First name *"
                        value={firstName.value}
                        onChange={(e) =>
                          this.handleChange('firstName', e.target.value)
                        }
                        error={Boolean(firstName.errMsg)}
                        helperText={firstName.errMsg}
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Last name *"
                        value={lastName.value}
                        onChange={(e) =>
                          this.handleChange('lastName', e.target.value)
                        }
                        error={Boolean(lastName.errMsg)}
                        helperText={lastName.errMsg}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="Email *"
                    value={email.value}
                    onChange={(e) => this.handleChange('email', e.target.value)}
                    error={Boolean(email.errMsg)}
                    helperText={email.errMsg}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Phone number"
                    value={phoneNumber.value}
                    onChange={(e) => this.handleChange('phoneNumber', e.target.value)}
                    error={Boolean(phoneNumber.errMsg)}
                    helperText={phoneNumber.errMsg}
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
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="Password confirm *"
                    type="password"
                    value={passwordConfirm.value}
                    onChange={(e) =>
                      this.handleChange('passwordConfirm', e.target.value)
                    }
                    error={Boolean(passwordConfirm.errMsg)}
                    helperText={passwordConfirm.errMsg}
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
                    REGISTER
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
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
                  <Grid container justify="space-between">
                    <Grid item></Grid>
                    <Grid item>
                      <Grid container spacing={1}>
                        <Grid item>
                          <p>Already have an account?</p>
                        </Grid>
                        <Grid item>
                          <Link to="/login">
                            <p><b>LOGIN</b></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);