(function () {
  "use strict";

  const router = require("router");
  const dataStoreProvider = require("/module/server/dataStoreProvider");
  const portletContextUtil = require("PortletContextUtil");
  const properties = require("Properties");
  const appData = require("appData");
  const mailBuilder = require("MailBuilder");
  const resourceLocatorUtil = require('ResourceLocatorUtil');
  const imageUtil = require('ImageUtil');
  const appService = require("/module/server/appService");

  router.get("/", (req, res) => {
    const items = dataStoreProvider.getItems();
    appService.renderItemImages(items);
    res.render("/", {
      items: items
    });
  });

  router.get("/userItems", (req, res) => {
    renderUserItems(res);
  });

  router.get("/create", (req, res) => {
    const currentUser = portletContextUtil.getCurrentUser();
    const userId = currentUser.getIdentifier();
    const userMail = properties.get(currentUser, "mail");
    const contactInfo = dataStoreProvider.getContactInfo(userId);
    res.render("/create", {
      contactInfo: contactInfo || { email: userMail },
    });
  });

  router.post("/create", (req, res) => {
    const currentUser = portletContextUtil.getCurrentUser();
    const userId = currentUser.getIdentifier();
    const itemsLimit = appData.get("itemsLimit");
    const userItems = appService.getUserItems();
    if (userItems.length < itemsLimit) {
      const contactInfo = {
        email: req.params.email,
        name: req.params.name,
        phoneNumber: req.params.phoneNumber,
      };
      dataStoreProvider.setContactInfo(userId, contactInfo);
      const file = req.file('file');
      const repository = resourceLocatorUtil.getLocalImageRepository();
      const image = imageUtil.createImageFromTemporary(repository, file);
      const imageId = image.getIdentifier();
      const item = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price,
        userId: userId,
        contactInfo: contactInfo,
        imageId: imageId
      };
      dataStoreProvider.createItem(item);
      renderUserItems(res);
    } else {
      res.render("/itemsLimitExceeded", {});
    }
  });

  router.get("/edit", (req, res) => {
    if (appService.hasWriteAccess(req.params.id)) {
      const item = dataStoreProvider.getItem(req.params.id);
      appService.renderItemImages([item]);
      res.render("/edit", {
        item: item
      });
    }
  });

  router.post("/edit", (req, res) => {
    if (appService.hasWriteAccess(req.params.dsid)) {
      const item = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price,
        contactInfo: {
          email: req.params.email,
          name: req.params.name,
          phoneNumber: req.params.phoneNumber,
        },
      };
      dataStoreProvider.setItem(req.params.dsid, item);
      const currentUser = portletContextUtil.getCurrentUser();
      const userId = currentUser.getIdentifier();
      dataStoreProvider.setContactInfo(userId, item.contactInfo);
    }
    renderUserItems(res);
  });

  router.post("/remove", (req, res) => {
    const itemId = req.params.dsid;
    if (appService.hasWriteAccess(itemId)) {
      const item = dataStoreProvider.getItem(itemId);
      dataStoreProvider.removeItem(itemId);
      appService.removeImage(item.imageId);
    }
    renderUserItems(res);
  });

  router.post("/removeAll", (req, res) => {
    const currentUser = portletContextUtil.getCurrentUser();
    const userId = currentUser.getIdentifier();
    const items = dataStoreProvider.getItems(userId);
    items.forEach(item => {
      dataStoreProvider.removeItem(item.dsid);
      appService.removeImage(item.imageId);
    });
    renderUserItems(res);
  });

  router.post("/report", (req, res) => {
    const administratorEmail = appData.get("administratorEmail");
    var mail = mailBuilder
      .setSubject(req.params.subject)
      .setTextMessage(req.params.text)
      .addRecipient(administratorEmail)
      .build();
    const mailSent = mail.send();
    res.json({ mailSent: mailSent });
  });

  router.get("/upload/:id", (req, res) => {
    const itemId = req.params.id;
    res.render("/upload", {
      id: itemId,
    });
  });

  router.post('/upload/:id', (req, res) => {
    const itemId = req.params.id;
    if (appService.hasWriteAccess(itemId)) {
      const item = dataStoreProvider.getItem(itemId);
      const oldImageId = item.imageId;
      const file = req.file('file');
      const repository = resourceLocatorUtil.getLocalImageRepository();
      const image = imageUtil.createImageFromTemporary(repository, file);
      item.imageId = image.getIdentifier();
      dataStoreProvider.setItem(itemId, item);
      appService.removeImage(oldImageId);
    }
    renderUserItems(res);
  });
 
  function renderUserItems(res) {
    res.render("/userItems", {
      items: appService.getUserItems(),
    });
  }

})();
