define(function (require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/main');
  const createTemplate = require('/template/create');
  const editTemplate = require('/template/edit');
  const userAdsTemplate = require('/template/userAds');
  const adsLimitExceededTemplate = require('/template/adsLimitExceeded');

  return Component.extend({

    getTemplate: function() {
      if (this.state.route === '/create') {
        return createTemplate;
      } else if (this.state.route === '/edit') {
        return editTemplate;
      } else if (this.state.route === '/userAds') {
        return userAdsTemplate;
      } else if (this.state.route === '/adsLimitExceeded') {
        return adsLimitExceededTemplate;
      }
      return template;
    },

    className: 'webapp-boilerplate',

    filterState: ({route}) => ({route}),
  });
});
