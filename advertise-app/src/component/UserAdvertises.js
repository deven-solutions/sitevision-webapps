define(function(require) {
  'use strict';

  var ListComponent = require('ListComponent');

  return ListComponent.extend({

     tagName: 'ul',

     childProperty: 'advertises',

     childComponentPath: 'UserAdvertise',

     filterState: ({advertises}) => ({advertises})
  });
});	