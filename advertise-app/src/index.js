(function () {
  'use strict';

  const router = require('router');
  const dataStoreProvider = require('/module/server/dataStoreProvider');
  const portletContextUtil = require('PortletContextUtil');
  const properties = require('Properties');
  const appData = require('appData');
  const logUtil = require('LogUtil');
  

  router.get('/', (req, res) => {
    res.render('/', {
      advertises: dataStoreProvider.getAdvertises()
    });
  });

  router.get('/userAds', (req, res) => {
    renderUserAdvertises(res);
  });

  router.get('/create', (req, res) => {
    res.render('/create', {});
  });

  router.post('/create', (req, res) => {
    const adsLimit = appData.get('adsLimit');
    const userAdvertises = getUserAdvertises();
    if (userAdvertises.length < adsLimit) {
      var advertise = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price,
        userMail: properties.get(portletContextUtil.getCurrentUser(), 'mail')
      };
      dataStoreProvider.createAdvertise(advertise);
      renderUserAdvertises(res);
    } else {
      res.render('/adsLimitExceeded', {});
    }
  });

  router.get('/edit', (req, res) => {
    if (hasWriteAccess(req.params.id)) {
      res.render('/edit', {
        advertise: dataStoreProvider.getAdvertise(req.params.id)
      });
    }
  });

  router.post('/edit', (req, res) => {
    if (hasWriteAccess(req.params.dsid)) {
      const advertise = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price
      };
      dataStoreProvider.editAdvertise(req.params.dsid, advertise);
    }
    renderUserAdvertises(res);
  });

  router.post('/remove', (req, res) => {
    var dsid = req.params.dsid;
    if (hasWriteAccess(dsid)) {
      dataStoreProvider.removeAdvertise(dsid);
    }
    renderUserAdvertises(res);
  });

  function renderUserAdvertises(res) {
    res.render('/userAds', {
      advertises: getUserAdvertises()
    });
  }

  function getUserAdvertises() {
    const currentUserEmail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
    return dataStoreProvider.getAdvertises(currentUserEmail);
  }

  function hasWriteAccess(adsId) {
    const advertise = dataStoreProvider.getAdvertise(adsId);
    const currentUserMail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
    return advertise.userMail === currentUserMail;
  }

})();
