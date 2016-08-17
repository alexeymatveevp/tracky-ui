//import $ from 'jquery';
//import _ from 'lodash';
//import mockjax from 'jquery-mockjax';
//require('script!../../../node_modules/jquery-mockjax/dist/jquery.mockjax.min.js');

var $ = require('jquery');
var mj = require('jquery-mockjax');
var mockjax = mj($, window);
// https://www.npmjs.com/package/jquery-mockjax

mockjax({
    url: "/trackies",
    responseText: {
        status: "success",
        fortune: "Are you a mock turtle?"
    }
});
