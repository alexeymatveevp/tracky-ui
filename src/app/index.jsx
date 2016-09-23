import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
window.$ = window.jQuery = require('jquery');
import _ from 'lodash';
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
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import moment from 'moment';
require('moment-duration-format');

// mocking
import 'mock';

// styling
require('style!css!sass!./scss/style.scss');

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.chooseProject = this.chooseProject.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.collectTracky = this.collectTracky.bind(this);
        this.updateTextField = this.updateTextField.bind(this);
        this.snackbarClose = this.snackbarClose.bind(this);
    };

    // use this to set the initial state
    componentWillMount() {
      this.setState({
        timerStarted: false,
        timerHasTime: false,
        timerSeconds: 0,
        snackbarOpen: false,
        snackbarMsg: ''
      });
    }

    componentDidMount() {
        this.serverRequest = $.get('/trackies', function(response) {
            this.setState({ trackies: response.data });
        }.bind(this));
    }

    chooseProject(event, index, value) {
        this.setState({project: value});
    }

    startTimer(event) {
      var that = this;
      this.timerInterval = setInterval(function() {
        var time = that.state.timerSeconds;
        time = time + 1;
        this.setState({ timerSeconds: time });
      }.bind(that), 1000);
      this.setState({ timerStarted: true });
      this.setState({ timerHasTime: true });
    }

    stopTimer(event) {
      clearInterval(this.timerInterval);
      this.setState(update(this.state, {
        timerStarted: {
          $set: false
        }
      }));
    }

    collectTracky() {
      clearInterval(this.timerInterval);
      var trackies = this.state.trackies;
      var maxId = _.maxBy(trackies, function(t) { return t.id; }).id;
      var newTracky = {
        id: maxId + 1,
        text: this.state.textField
      };
      if (newTracky.text) {
        trackies.push(newTracky);
      }
      // send a server request to submit tracky and get the new ID or error
      var that = this;
      $.post('/tracky', newTracky, function(response) {
        if (response.success) {
          var createdTracky = _.find(this.state.trackies, function(t) { return t.id == newTracky.id; });
          createdTracky.id = response.data;
        } else {
          this.setState({snackbarOpen: true});
          this.setState({snackbarMsg: response.msg});
        }
      }.bind(that));

      this.setState({timerStarted: false});
      this.setState({timerSeconds: 0});
      this.setState({trackies: trackies});
      this.setState({timerHasTime: false});
      this.setState({textField: ''});
      this.refs.textField.input.value = '';
    }

    updateTextField(e) {
      this.setState({textField: e.target.value});
    }

    snackbarClose() {
      this.setState({snackbarOpen: false});
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
                    <Paper className="tracky-box">
                        <TextField ref="textField" hintText="what are you doing?" underlineShow={false} className="text-field" onChange={this.updateTextField}/>
                        <DropDownMenu value={(this.state.project) ? this.state.project : undefined} onChange={this.chooseProject} className="select"
                            animated={false}>
                            <MenuItem value={1} primaryText="work"/>
                            <MenuItem value={2} primaryText="tree-project"/>
                            <MenuItem value={3} primaryText="tracking-alternative"/>
                        </DropDownMenu>
                        <span>{(() => {
                          if (this.state.timerSeconds) {
                            var d = moment.duration(this.state.timerSeconds, 's');
                            // var ss = d.format('ss', { forceLength: true });
                            // var mm = d.format('mm', { forceLength: true });
                            // var hh = d.format('hh', { forceLength: true });
                            // return hh + ':' + mm + ':' + ss;
                            return d.hours() + ':' + d.minutes() + ':' + d.seconds();
                          }
                        })()}</span>
                        {(() => {
                          if (!this.state.timerStarted) {
                            return <FlatButton label="Start timer" primary={true} onClick={this.startTimer}/>
                          } else {
                            return <FlatButton label="Stop timer" primary={false} onClick={this.stopTimer}/>
                          }
                        })()}
                        {(() => {
                          if (this.state.timerHasTime) {
                            return <FlatButton label="Add tracky" primary={false} onClick={this.collectTracky}/>
                          }
                        })()}
                    </Paper>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderColumn>id</TableHeaderColumn>
                          <TableHeaderColumn>text</TableHeaderColumn>
                          <TableHeaderColumn>project</TableHeaderColumn>
                          <TableHeaderColumn>duration</TableHeaderColumn>
                          <TableHeaderColumn>date</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          if (this.state.trackies) {
                            return this.state.trackies.map(function(t) {
                              return <TableRow key={t.id}>
                                <TableRowColumn>{t.id}</TableRowColumn>
                                <TableRowColumn>{t.text}</TableRowColumn>
                                <TableRowColumn>{t.project}</TableRowColumn>
                                <TableRowColumn>{moment.duration(t.duration, 's').format('h[h] m[m] s[s]').toString()}</TableRowColumn>
                                <TableRowColumn>{moment(t.date).format('DD.MM.YYYY').toString()}</TableRowColumn>
                              </TableRow>
                              // return <ListItem primaryText={t.text} value={t.id} key={t.id}/>
                            })
                          }
                        })()}
                      </TableBody>
                    </Table>
                    <Snackbar open={this.state.snackbarOpen} message={this.state.snackbarMsg} autoHideDuration={4000} onRequestClose={this.snackbarClose} />
                </div>
            </MuiThemeProvider>
        )
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
