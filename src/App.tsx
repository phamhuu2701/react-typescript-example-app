import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from './actions';
import { RootState } from './reducers';
import { AuthState } from './types/auth';

interface Props {
  auth: AuthState,
  actions: typeof Actions
}

interface State {

}

function mapStateToProps(state: RootState) {
  return {
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }
  setAuth = () => {
    const { actions } = this.props
    let auth = {
      user: { username: 'admin' },
      logged: true,
      token: '00000'
    }
    actions.changeAuthAction(auth)
  }
  render() {
    console.log('this.props :>> ', this.props);
    return (
      <div className="app">
        <button onClick={() => this.setAuth()}>Set Auth</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);