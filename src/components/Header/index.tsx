import { Grid, TextField, Paper, FormControl, Avatar, InputAdornment } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import { RootState } from '../../reducers';
import { AuthState } from '../../types/auth';
import './styles.scss'
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

interface Props {
  auth: AuthState,
}

interface State {
  search: string,
}

function mapStateToProps(state: RootState) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}


class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  private searchTimeout: any = null

  handleSearch = async (value: string) => {
    console.log('handleSearch value :>> ', value);
  }
  handleChangeSearch = (value: string) => {
    this.setState({ search: value })

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    this.searchTimeout = setTimeout(() => {
      this.handleSearch(value)
    }, 400)
  }
  render() {
    const { auth } = this.props
    const { search } = this.state
    const { user } = auth
    return (
      <div className="header">
        <Paper square>
          <Grid container justify="space-between">
            <Grid item>

            </Grid>
            <Grid item xs sm={6}>
              <FormControl fullWidth>
                <TextField
                  placeholder="Search"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={search}
                  onChange={e => this.handleChangeSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end" onClick={() => this.handleChangeSearch('')}>
                        {Boolean(search) && <CancelIcon />}
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <div className="header-item">
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar alt={user.fullName} src={user.avatar} />
                  </Grid>
                  <Grid item>
                    <b>{user.fullName}</b>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);