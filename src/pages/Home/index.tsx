import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import { RootState } from '../../reducers';
import { AuthState } from '../../types/auth';

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


class Home extends React.Component<Props, State> {
  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);