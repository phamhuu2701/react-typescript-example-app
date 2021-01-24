import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import { RootState } from '../../reducers';
import './styles.scss'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ArchiveIcon from '@material-ui/icons/Archive';
import GroupIcon from '@material-ui/icons/Group';
import AssessmentIcon from '@material-ui/icons/Assessment';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AppsIcon from '@material-ui/icons/Apps';

interface Props {

}

interface State {
  navSelected: string,
  subNavSelected: string,
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


class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      navSelected: '',
      subNavSelected: '',
    }
  }
  handleSelectNav = (value: string) => {
    const { navSelected } = this.state
    this.setState({ navSelected: navSelected !== value ? value : '', subNavSelected: '' })
  }
  handleSelectSubNav = (value: string) => {
    const { subNavSelected } = this.state
    this.setState({ subNavSelected: subNavSelected !== value ? value : '' })
  }
  render() {
    const { navSelected, subNavSelected } = this.state

    const navs = [
      {
        label: 'Home',
        key: 'home',
        icon: <HomeIcon />,
        items: [],
      },
      {
        label: 'Orders',
        key: 'orders',
        icon: <ReceiptIcon />,
        items: [
          {
            label: 'Orders',
            key: 'orders',
          },
          {
            label: 'Drafts',
            key: 'drafts',
          },
          {
            label: 'Abandoned checkouts',
            key: 'abandoned_checkouts',
          },
        ],
      },
      {
        label: 'Products',
        key: 'products',
        icon: <ArchiveIcon />,
        items: [
          {
            label: 'All products',
            key: 'all_products',
          },
          {
            label: 'Inventory',
            key: 'inventory',
          },
          {
            label: 'Transfers',
            key: 'transfers',
          },
          {
            label: 'Collections',
            key: 'collections',
          },
          {
            label: 'Gift cards',
            key: 'gift_cards',
          },
        ],
      },
      {
        label: 'Customers',
        key: 'customers',
        icon: <GroupIcon />,
        items: [],
      },
      {
        label: 'Analytics',
        key: 'analytics',
        icon: <AssessmentIcon />,
        items: [
          {
            label: 'Dashboards',
            key: 'dashboards',
          },
          {
            label: 'Reports',
            key: 'reports',
          },
          {
            label: 'Live view',
            key: 'live_view',
          },
        ],
      },
      {
        label: 'Marketing',
        key: 'marketing',
        icon: <LoyaltyIcon />,
        items: [],
      },
      {
        label: 'Discounts',
        key: 'discounts',
        icon: <LocalAtmIcon />,
        items: [],
      },
      {
        label: 'Apps',
        key: 'apps',
        icon: <AppsIcon />,
        items: [],
      },
    ]

    return (
      <div className="sidebar">
        <List component="nav">
          {navs?.length > 0 && navs.map(item => item.items?.length > 0
            ? (
              <div key={item.key}>
                <ListItem button onClick={() => this.handleSelectNav(item.key)} selected={navSelected === item.key}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {navSelected !== item.key ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={navSelected === item.key} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items?.length > 0 && item.items.map(_item => (
                      <ListItem button key={_item.key} onClick={() => this.handleSelectSubNav(_item.key)} selected={subNavSelected === _item.key}>
                        <ListItemText primary={_item.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ) : (
              <ListItem button key={item.key} onClick={() => this.handleSelectNav(item.key)} selected={navSelected === item.key}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);