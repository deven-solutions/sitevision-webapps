(function () {
  "use strict";

  const router = require("router");
  const dataStoreProvider = require("/module/server/dataStoreProvider");
  const portletContextUtil = require("PortletContextUtil");
  const properties = require("Properties");
  const appData = require("appData");
  const mailBuilder = require("MailBuilder");
  const logUtil = require("LogUtil");
  const resourceLocatorUtil = require('ResourceLocatorUtil');
  const imageUtil = require('ImageUtil');
  const imageRenderer = require('ImageRenderer');
  const utils = require('Utils');

  router.get("/", (req, res) => {
    const items = dataStoreProvider.getItems();
    renderItemImages(items);
    res.render("/", {
      items: items,
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
    const contactInfo = {
      email: req.params.email,
      name: req.params.name,
      phoneNumber: req.params.phoneNumber,
    };
    dataStoreProvider.setContactInfo(userId, contactInfo);
    const itemsLimit = appData.get("itemsLimit");
    const userItems = getUserItems();
    if (userItems.length < itemsLimit) {
      const item = {
        title: req.params.title,
        description: req.params.description,
        price: req.params.price,
        userId: userId,
        contactInfo: contactInfo,
      };
      const id = dataStoreProvider.createItem(item);
      res.render("/upload", { id: id });
    } else {
      res.render("/itemsLimitExceeded", {});
    }
  });

  router.get("/edit", (req, res) => {
    if (hasWriteAccess(req.params.id)) {
      const item = dataStoreProvider.getItem(req.params.id);
      renderItemImages([item]);
      res.render("/edit", {
        item: item
      });
    }
  });

  router.post("/edit", (req, res) => {
    if (hasWriteAccess(req.params.dsid)) {
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
      dataStoreProvider.editItem(req.params.dsid, item);
      const currentUser = portletContextUtil.getCurrentUser();
      const userId = currentUser.getIdentifier();
      dataStoreProvider.setContactInfo(userId, item.contactInfo);
    }
    renderUserItems(res);
  });

  router.post("/remove", (req, res) => {
    const dsid = req.params.dsid;
    if (hasWriteAccess(dsid)) {
      dataStoreProvider.removeItem(dsid);
    }
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

  router.post('/upload/:id', (req, res) => {
    const itemId = req.params.id;
    if (hasWriteAccess(itemId)) {
      const file = req.file('file');
      const repository = resourceLocatorUtil.getLocalImageRepository();
      const image = imageUtil.createImageFromTemporary(repository, file);
      const item = dataStoreProvider.getItem(req.params.id);
      item.imageId = image.getIdentifier();
      dataStoreProvider.editItem(itemId, item);
    }
    renderUserItems(res);
 });

  function renderItemImages(items) {
    const nodes = resourceLocatorUtil.getLocalImageRepository().getNodes();
    for (const index in items) {
      const item = items[index];
      while (nodes.hasNext()) {
        const node = nodes.next();
        if (node.getIdentifier() === item.imageId) {
          const imageScaler = utils.getImageScaler(200, 200);
          imageRenderer.setImageScaler(imageScaler);
          imageRenderer.clearSourceSetMode();
          imageRenderer.update(node);
          imageRenderer.forceUseImageScaler();
          item.image = imageRenderer.render();
          break;
        }
      }
    }
  }

  function renderUserItems(res) {
    res.render("/userItems", {
      items: getUserItems(),
    });
  }

  function getUserItems() {
    const currentUser = portletContextUtil.getCurrentUser();
    const userId = currentUser.getIdentifier();
    const items = dataStoreProvider.getItems(userId);
    renderItemImages(items);
    return items;
  }

  function hasWriteAccess(id) {
    const item = dataStoreProvider.getItem(id);
    const currentUser = portletContextUtil.getCurrentUser();
    const userId = currentUser.getIdentifier();
    return item.userId === userId;
  }
})();
