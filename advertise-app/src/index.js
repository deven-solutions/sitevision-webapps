(function () {
  'use strict';

  const router = require('router');
  const dataStoreProvider = require('/module/server/dataStoreProvider');

  router.get('/', (req, res) => {
    res.render('/', {
      advertises: dataStoreProvider.getAllAdvertises()
    });
  });

  router.get('/create', (req, res) => {
    res.render('/create', {});
  });

  router.post('/create', (req, res) => {
    var advertise = {
      title: req.params.title,
      description: req.params.description,
      price: req.params.price
    };
    dataStoreProvider.createAdvertise(advertise);
    res.render('/', {
      advertises: dataStoreProvider.getAllAdvertises()
    });
  });

  router.get('/edit', (req, res) => {
    res.render('/edit', {
      advertise: dataStoreProvider.getAdvertise(req.params.id)
    });
  });

  router.post('/edit', (req, res) => {
    var advertise = {
      title: req.params.title,
      description: req.params.description,
      price: req.params.price
    };
    dataStoreProvider.editAdvertise(req.params.dsid, advertise);
    res.render('/', {
      advertises: dataStoreProvider.getAllAdvertises()
    });
  });

  router.post('/remove', (req, res) => {
    var dsid = req.params.dsid;
    dataStoreProvider.removeAdvertise(dsid);
    res.render('/', {
      advertises: dataStoreProvider.getAllAdvertises()
    });
  });

})();
