define(function(require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/item');
  const requester = require('requester');
  const router = require('router');

  return Component.extend({
     template,
     tagName: 'tr',
     onRendered: function() {
      const modalBtn = document.getElementById('report-modal-btn-' + this.state.id);
      modalBtn.addEventListener("click", () => {
        const text = document.getElementById('report-modal-text-' + this.state.id);
        requester.doPost({
          url: router.getUrl('/report/' + this.state.id),
          data: {
            text: text.value
          }
        });
      });
     },
     filterState: function(state, options) {
      const item = state.items.find(ad => ad.id === options.id);
      return Object.assign({}, item);
    }
  });
});