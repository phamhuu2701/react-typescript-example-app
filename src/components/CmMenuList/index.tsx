import { Popover } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Actions from '../../actions';
import { RootState } from '../../reducers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

interface ListItem {
  label: string,
  value: string | number,
  icon?: object | any,
}

interface Props {
  activator: object | any,
  items: ListItem[],
  onSelect: (value: string | number) => void,
}

interface State {
  anchorEl: any,
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


class CmMenuList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }
  handleClickPopover = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClosePopover = () => {
    this.setState({ anchorEl: null });
  };
  handleSelect = (value: string | number) => {
    const { onSelect } = this.props
    this.setState({ anchorEl: null });
    onSelect(value)
  }
  render() {
    const { activator, items, onSelect } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl);
    const id = open ? `popover-${Date.now()}` : undefined;

    return (
      <div className="cm-menu-list">
        <div id={id} onClick={(e) => this.handleClickPopover(e)}>{activator}</div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => this.handleClosePopover()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List component="nav">
            {items?.length > 0 && items.map((item, index) => (
              <ListItem button key={index} onClick={() => this.handleSelect(item.value)}>
                {item.icon && (
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Popover>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CmMenuList);