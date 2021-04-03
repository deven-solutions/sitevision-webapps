define(function(require) {
  'use strict';

  var ListComponent = require('ListComponent');

  return ListComponent.extend({

     tagName: 'ul',

     childProperty: 'items',

     childComponentPath: 'Item',

     filterState: ({items}) => ({items}),
     
  });
});	