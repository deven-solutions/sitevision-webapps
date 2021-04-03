define(function(require) {
  'use strict';

  var Component = require('Component');
  var template = require('/template/editForm');

  return Component.extend({
     template,

     filterState: ({item}) => ({item})
  });
});