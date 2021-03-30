define(function(require) {
  'use strict';

  var Component = require('Component');
  var template = require('/template/advertise');

  return Component.extend({
     template,
     tagName: 'tr'
  });
});