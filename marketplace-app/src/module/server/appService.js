define(function (require) {
  "use strict";

  const logUtil = require("LogUtil");
  const appData = require("appData");
  const resourceLocatorUtil = require("ResourceLocatorUtil");
  const outputUtil = require("OutputUtil");
  const properties = require("Properties");
  const trashcanUtil = require("TrashcanUtil");
  const imageRenderer = require("ImageRenderer");
  const utils = require("Utils");
  const portletContextUtil = require("PortletContextUtil");
  const dataStoreProvider = require("/module/server/dataStoreProvider");
  const imageUtil = require("ImageUtil");
  const mailBuilder = require("MailBuilder");

  function getNodeProperty(parentNode, nodeId, propertyName) {
    return whenNodeId(parentNode, nodeId, (node) =>
      properties.get(node, propertyName)
    );
  }

  function whenNodeId(parentNode, id, callback) {
    const nodes = parentNode.getNodes();
    while (nodes.hasNext()) {
      const node = nodes.next();
      if (node.getIdentifier() === id) {
        return callback(node);
      }
    }
  }

  function getCurrentUserId() {
    const currentUser = portletContextUtil.getCurrentUser();
    return currentUser.getIdentifier();
  }

  function createImage(file) {
    const repository = resourceLocatorUtil.getLocalImageRepository();
    const image = imageUtil.createImageFromTemporary(repository, file);
    return image.getIdentifier();
  }

  function setContactInfo(email, name, phoneNumber) {
    const userId = getCurrentUserId();
    const contactInfo = {
      email: email,
      name: name,
      phoneNumber: phoneNumber,
    };
    dataStoreProvider.setContactInfo(userId, contactInfo);
    return contactInfo;
  }

  function renderItemImages(items) {
    items.forEach((item) => {
      const imageRepository = resourceLocatorUtil.getLocalImageRepository();
      whenNodeId(imageRepository, item.imageId, (node) => {
        const imageScaler = utils.getImageScaler(200, 200);
        imageRenderer.setImageScaler(imageScaler);
        imageRenderer.clearSourceSetMode();
        imageRenderer.update(node);
        imageRenderer.forceUseImageScaler();
        item.image = imageRenderer.render();
      });
      if (!item.image) {
        // Default image if missing
        item.image =
          "<img src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' width='200' height='200' alt='' />";
      }
    });
  }

  function removeImage(imageId) {
    const imageRepository = resourceLocatorUtil.getLocalImageRepository();
    whenNodeId(imageRepository, imageId, (node) =>
      trashcanUtil.moveNodeToTrashcan(node)
    );
  }

  function getFontClassName(configProperty) {
    const fontTitleId = appData.get(configProperty);
    const repository = resourceLocatorUtil.getFontRepository();
    return getNodeProperty(repository, fontTitleId, "selectorText");
  }

  return {
    replaceImage(itemId, file) {
      const item = dataStoreProvider.getItem(itemId);
      const oldImageId = item.imageId;
      item.imageId = createImage(file);
      dataStoreProvider.setItem(itemId, item);
      removeImage(oldImageId);
    },
    sendMailToAdmin(subject, text) {
      const administratorEmail = appData.get("administratorEmail");
      var mail = mailBuilder
        .setSubject(subject)
        .setTextMessage(text)
        .addRecipient(administratorEmail)
        .build();
      return mail.send();
    },
    removeUserItems() {
      const userId = getCurrentUserId();
      const items = dataStoreProvider.getItems(userId);
      items.forEach((item) => {
        dataStoreProvider.removeItem(item.dsid);
        removeImage(item.imageId);
      });
    },
    removeItem(itemId) {
      const item = dataStoreProvider.getItem(itemId);
      dataStoreProvider.removeItem(itemId);
      removeImage(item.imageId);
    },
    setItem(itemId, title, description, price, email, name, phoneNumber) {
      const userId = getCurrentUserId();
      const contactInfo = setContactInfo(email, name, phoneNumber);
      const item = {
        title: title,
        description: description,
        price: price,
        userId: userId,
        contactInfo: contactInfo,
      };
      dataStoreProvider.setItem(itemId, item);
    },
    getItem(itemId) {
      const item = dataStoreProvider.getItem(itemId);
      renderItemImages([item]);
      return item;
    },
    createItem(title, description, price, email, name, phoneNumber, file) {
      const userId = getCurrentUserId();
      const contactInfo = setContactInfo(email, name, phoneNumber);
      const imageId = createImage(file);
      const item = {
        title: title,
        description: description,
        price: price,
        userId: userId,
        contactInfo: contactInfo,
        imageId: imageId,
      };
      dataStoreProvider.createItem(item);
    },
    itemsLimitNotExceeded() {
      const userId = getCurrentUserId();
      const itemsLimit = appData.get("itemsLimit");
      const items = dataStoreProvider.getItems(userId);
      return items.length < itemsLimit;
    },
    getContactInfo() {
      const userId = getCurrentUserId();
      const userMail = properties.get(userId, "mail");
      const contactInfo = dataStoreProvider.getContactInfo(userId);
      return contactInfo || { email: userMail };
    },
    getItems(userIdFilter) {
      const items = dataStoreProvider.getItems(userIdFilter);
      renderItemImages(items);
      const titleClass = getFontClassName("fontTitle");
      items.forEach((item) => {
        item.id = item.dsid; // Required by ListComponent
        item.titleClass = titleClass;
      });
      return items;
    },
    hasWriteAccess(itemId) {
      const item = dataStoreProvider.getItem(itemId);
      const userId = getCurrentUserId();
      return item.userId === userId;
    },
    getUserItems() {
      const userId = getCurrentUserId();
      const items = this.getItems(userId);
      return items;
    },
    logNode(prefix, node) {
      logUtil.info(prefix + " " + outputUtil.getNodeInfoAsHTML(node));
    },
  };
});