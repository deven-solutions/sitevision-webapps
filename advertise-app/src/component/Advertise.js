define(function(require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/advertise');
  const requester = require('requester');
  const router = require('router');

  return Component.extend({
     template,
     tagName: 'tr',
     onRendered: function() {
      requester.doGet({
        url: router.getUrl('/hasWriteAccess/' + this.state.id),
        context: this
      }).done(function(response) {
        if (response.access) {
          this.$('.display-none').removeClass('display-none');
        }
      });
     },
     filterState: function(state, options) {
      const advertise = state.advertises.find(ad => ad.id === options.id);
      return Object.assign({}, advertise);
    }
  });
});