//import $ from 'jquery';
//import _ from 'lodash';
//import mockjax from 'jquery-mockjax';
//require('script!../../../node_modules/jquery-mockjax/dist/jquery.mockjax.min.js');
import trackies from 'trackies';

var $ = require('jquery');
var mj = require('jquery-mockjax');
var mockjax = mj($, window);
// https://www.npmjs.com/package/jquery-mockjax

mockjax({
    url: "/trackies",
    responseText: trackies
});

mockjax({
  type: 'POST',
  url: '/tracky',
  response: function(settings) {
    if (!settings.data.text) {
      this.responseText = {
        success: false,
        msg: 'empty text of tracky'
      }
      return;
    }
    this.responseText = {
      success: true,
      data: settings.data.id + 1
    }
  }
})
