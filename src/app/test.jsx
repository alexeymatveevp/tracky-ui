import React from 'react';
import ReactDOM from 'react-dom';
// test data
import trackies from './mock/trackies';
// required files
require('file?name=test.html!./test.html')

var ListBox = React.createClass({
    asdf: 1,
    render: function()  {
        return (
            <ul>
                {this.props.data.map(function(obj, i) {
                    return (
                        <ListItem key={obj.id} item={obj}/>
                    )
                }, this)}
            </ul>
        )
    }
});

var ListItem = React.createClass({
    render: function()  {
        return (
            <li style={{padding: '5px 5px 5px 30px', border: '1px solid blue'}}>
                <span>{this.props.item.id}</span>
                <p>{this.props.item.text}</p>
            </li>
        )
    }
});

ReactDOM.render(
    <ListBox data={trackies}/>,
    document.getElementById('content')
);