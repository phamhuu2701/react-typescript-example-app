import { Grid, TextField, Paper, FormControl, Avatar, InputAdornment, IconButton } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import { RootState } from '../../reducers';
import { AuthState } from '../../types/auth';
import './styles.scss'
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Sidebar from '../Sidebar';
import CmMenuList from '../CmMenuList';
import { USER_TOKEN } from '../../utils/localStorage';

interface DrawerState {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean,
}

interface Props {
  auth: AuthState,
  actions: typeof Actions
}

interface State {
  search: string,
  drawerState: DrawerState | any,
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
      search: '',
      drawerState: {
        top: false,
        left: false,
        bottom: false,
        right: false,
      }
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
  toggleDrawer = (anchor: string, open: boolean) => {
    const { drawerState } = this.state
    this.setState({ drawerState: { ...drawerState, [anchor]: open } });
  };
  handleAccountMenuListSelect = (value: string | number) => {
    const { actions } = this.props
    if (value === 'logout') {
      USER_TOKEN.delete();
      actions.userLogoutAction()
    } else {
      console.log('handleAccountMenuListSelect value :>> ', value);
    }
  }
  render() {
    const { auth } = this.props
    const { search, drawerState } = this.state
    const { user } = auth

    const drawerContent = (anchor: string) => (
      <div role="presentation">
        <Sidebar />
      </div>
    );

    const accountMenuList = [
      { label: 'Profile', value: 'profile' },
      { label: 'Logout', value: 'logout' },
    ]

    return (
      <div className="header">
        <Paper square>
          <Grid container spacing={2} justify="space-between" alignItems="center">
            <Grid item>
              <div className="mobile-tablet-section">
                <div className="header-menu-icon">
                  <IconButton color="primary" onClick={() => this.toggleDrawer('left', true)}>
                    <MenuIcon />
                  </IconButton>
                </div>
              </div>
              <div className="desktop-section">
                <Grid container alignItems="center">
                  <Grid item>
                    <b>Admin Dashboard</b>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs sm={6}>
              <Grid container justify="center" alignItems="center">
                <Grid item xs={12}>
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
              </Grid>
            </Grid>
            <Grid item>
              <CmMenuList
                activator={
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
                }
                items={accountMenuList}
                onSelect={value => this.handleAccountMenuListSelect(value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {['left', 'right', 'top', 'bottom'].map((anchor: any | undefined) => (
          <React.Fragment key={anchor}>
            <Drawer anchor={anchor} open={drawerState[anchor]} onClose={() => this.toggleDrawer(anchor, false)}>
              {drawerContent(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);