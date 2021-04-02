define(function(require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/userAdvertise');

  return Component.extend({
     template,
     tagName: 'tr'
  });
});