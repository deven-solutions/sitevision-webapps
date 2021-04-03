define(function(require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/userItem');

  return Component.extend({
     template,
     tagName: 'tr'
  });
});