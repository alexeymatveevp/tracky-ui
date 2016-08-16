import React from 'react';
import ReactDOM from 'react-dom';
window.$ = window.jQuery = require('jquery');
// mocks
var mockjax = require('jquery-mockjax')
import mock from 'mock';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from '../../node_modules/material-ui/styles/MuiThemeProvider';
import AppBar from '../../node_modules/material-ui/AppBar';
import FlatButton from '../../node_modules/material-ui/FlatButton/FlatButton';
//import baseTheme from '../../node_modules/material-ui/styles/baseThemes/lightBaseTheme';
//import baseTheme from '../../node_modules/material-ui/styles/baseThemes/darkBaseTheme';
//import getMuiTheme from '../../node_modules/material-ui/styles/getMuiTheme';
import RaisedButton from '../../node_modules/material-ui/RaisedButton';
import Badge from '../../node_modules/material-ui/Badge';
import IconButton from '../../node_modules/material-ui/IconButton';
import NotificationsIcon from '../../node_modules/material-ui/svg-icons/social/notifications';
import FloatingActionButton from '../../node_modules/material-ui/FloatingActionButton';
import ContentAdd from '../../node_modules/material-ui/svg-icons/content/add';
import {List, ListItem} from '../../node_modules/material-ui/List';
import Subheader from '../../node_modules/material-ui/Subheader';
import ActionGrade from '../../node_modules/material-ui/svg-icons/action/grade';
import Divider from '../../node_modules/material-ui/Divider';
import {pinkA200, transparent} from '../../node_modules/material-ui/styles/colors';
import DropDownMenu from '../../node_modules/material-ui/DropDownMenu';
import MenuItem from '../../node_modules/material-ui/MenuItem';
import Paper from '../../node_modules/material-ui/Paper';

export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {value: 1};
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(event, index, value) {
        this.setState({value});
    }
    
    componentDidMount() {
        console.log('Component DID MOUNT!')
        this.serverRequest = $.get('/trackies.js', function(response) {
            console.log(response);
        });
    }
    
//    handleChange = (event, index, value) => this.setState({value});
    
    render() {
        var trackies = this.props.trackies;
        return(
            <MuiThemeProvider>
                <div>
                    <AppBar title="Trackyyyy">
                        <Badge badgeContent={10}
                            primary={true}
                            badgeStyle={{top: 10, right: 1}}>
                          <IconButton tooltip="Notifications">
                            <NotificationsIcon />
                          </IconButton>
                        </Badge>
                    </AppBar>
                    <RaisedButton label="defaef"/>
                    <FlatButton label="Default" />
                    <div>
                        <DropDownMenu value={this.state.value}
                                onChange={this.handleChange}>
                            <MenuItem value={1} primaryText="work"/>
                            <MenuItem value={2} primaryText="tree-project"/>
                            <MenuItem value={3} primaryText="tracking-alternative"/>
                        </DropDownMenu>
                        <FloatingActionButton secondary={true}>
                            <ContentAdd />
                        </FloatingActionButton>
                    </div>
                    <List>
                        <Subheader>Tracked items</Subheader>

                        <ListItem primaryText="todo item" leftIcon={<ActionGrade color={pinkA200} />} />
                    </List>
                </div>
            </MuiThemeProvider>
        )
    }
}

ReactDOM.render(
  <App trackies={[]}/>,
  document.getElementById('content')
);
