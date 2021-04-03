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
      items: dataStoreProvider.getItems()
    });
  });

  router.get('/userItems', (req, res) => {
    renderUserItems(res);
  });

  router.get('/create', (req, res) => {
    const userMail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
    const contactInfo = dataStoreProvider.getContactInfo(userMail);
    res.render('/create', {
      contactInfo: contactInfo || { email: userMail }
    });
  });

  router.post('/create', (req, res) => {
    const userMail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
    const contactInfo = {
      email: req.params.email,
      name: req.params.name,
      phoneNumber: req.params.phoneNumber
    };
    dataStoreProvider.setContactInfo(userMail, contactInfo);
    const itemsLimit = appData.get('itemsLimit');
    const userItems = getUserItems();
    if (userItems.length < itemsLimit) {
      const item = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price,
        userMail: userMail,
        contactInfo: contactInfo
      };
      dataStoreProvider.createItem(item);
      renderUserItems(res);
    } else {
      res.render('/itemsLimitExceeded', {});
    }
  });

  router.get('/edit', (req, res) => {
    if (hasWriteAccess(req.params.id)) {
      res.render('/edit', {
        item: dataStoreProvider.getItem(req.params.id)
      });
    }
  });

  router.post('/edit', (req, res) => {
    if (hasWriteAccess(req.params.dsid)) {
      const item = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price,
        contactInfo: {
          email: req.params.email,
          name: req.params.name,
          phoneNumber: req.params.phoneNumber 
        }
      };
      dataStoreProvider.editItem(req.params.dsid, item);
      const userMail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
      dataStoreProvider.setContactInfo(userMail, item.contactInfo);
    }
    renderUserItems(res);
  });

  router.post('/remove', (req, res) => {
    var dsid = req.params.dsid;
    if (hasWriteAccess(dsid)) {
      dataStoreProvider.removeItem(dsid);
    }
    renderUserItems(res);
  });

  router.post('/report/:id', (req, res) => {
    res.json({ id: req.params.id }); // TODO send mail
    logUtil.info("Send mail " + req.params.id + " Text: " + req.params.text);
  });

  function renderUserItems(res) {
    res.render('/userItems', {
      items: getUserItems()
    });
  }

  function getUserItems() {
    const currentUserEmail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
    return dataStoreProvider.getItems(currentUserEmail);
  }

  function hasWriteAccess(id) {
    const item = dataStoreProvider.getItem(id);
    const currentUserMail = properties.get(portletContextUtil.getCurrentUser(), 'mail');
    return item.userMail === currentUserMail;
  }

})();
