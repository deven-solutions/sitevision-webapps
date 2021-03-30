define(function (require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/main');
  const createTemplate = require('/template/create');
  const editTemplate = require('/template/edit');

  return Component.extend({

    getTemplate: function() {
      if (this.state.route === '/create') {
        return createTemplate;
      } else if (this.state.route === '/edit') {
        return editTemplate;
      }
      return template;
    },

    className: 'webapp-boilerplate',

    filterState: ({route, email, adsLimit}) => ({route, email, adsLimit}),
  });
});
