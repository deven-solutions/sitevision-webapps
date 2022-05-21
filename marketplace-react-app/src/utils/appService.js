import appData from "@sitevision/api/server/appData";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import outputUtil from "@sitevision/api/server/OutputUtil";
import properties from "@sitevision/api/server/Properties";
import trashcanUtil from "@sitevision/api/server/TrashcanUtil";
import imageRenderer from "@sitevision/api/server/ImageRenderer";
import utils from "@sitevision/api/server/Utils";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import imageUtil from "@sitevision/api/server/ImageUtil";
import logUtil from "@sitevision/api/server/LogUtil";
import mailBuilder from "@sitevision/api/server/MailBuilder";
import * as dataStoreProvider from "./dataStoreProvider";

export const replaceImage = (itemId, file) => {
  const item = dataStoreProvider.getItem(itemId);
  const oldImageId = item.imageId;
  item.imageId = createImage(file);
  dataStoreProvider.setItem(itemId, item);
  removeImage(oldImageId);
};

export const sendMailToAdmin = (subject, text) => {
  const administratorEmail = appData.get("administratorEmail");
  var mail = mailBuilder
    .setSubject(subject)
    .setTextMessage(text)
    .addRecipient(administratorEmail)
    .build();
  return mail.send();
};

export const removeUserItems = () => {
  const userId = getCurrentUserId();
  const items = dataStoreProvider.getItems(userId);
  items.forEach((item) => {
    dataStoreProvider.removeItem(item.dsid);
    removeImage(item.imageId);
  });
};

export const removeItem = (itemId) => {
  const item = dataStoreProvider.getItem(itemId);
  dataStoreProvider.removeItem(itemId);
  removeImage(item.imageId);
};

export const setItem = (
  itemId,
  title,
  description,
  price,
  email,
  name,
  phoneNumber
) => {
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
};

export const getItem = (itemId) => {
  const item = dataStoreProvider.getItem(itemId);
  renderItemImages([item]);
  return item;
};

export const createItem = (
  title,
  description,
  price,
  email,
  name,
  phoneNumber,
  file
) => {
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
    image: "",
  };
  dataStoreProvider.createItem(item);
};

export const itemsLimitNotExceeded = () => {
  const userId = getCurrentUserId();
  const itemsLimit = appData.get("itemsLimit");
  const items = dataStoreProvider.getItems(userId);
  return items.length < itemsLimit;
};

export const getContactInfo = () => {
  const userId = getCurrentUserId();
  const userMail = properties.get(userId, "mail");
  const contactInfo = dataStoreProvider.getContactInfo(userId);
  return contactInfo || { email: userMail };
};

export const getItems = (userIdFilter) => {
  const items = dataStoreProvider.getItems(userIdFilter);
  renderItemImages(items);
  const titleClass = getFontClassName("fontTitle");
  items.forEach((item) => {
    item.id = item.dsid; // Required by ListComponent
    item.titleClass = titleClass;
  });
  return items;
};

export const hasWriteAccess = (itemId) => {
  const item = dataStoreProvider.getItem(itemId);
  const userId = getCurrentUserId();
  return item.userId === userId;
};

export const getUserItems = () => {
  const userId = getCurrentUserId();
  const items = getItems(userId);
  return items;
};

export const logNode = (prefix, node) => {
  logUtil.info(prefix + " " + outputUtil.getNodeInfoAsHTML(node));
};

export const isLoggedIn = () => {
  return portletContextUtil.getCurrentUser() != "Anonymous";
};

const getCurrentUserId = () => {
  const currentUser = portletContextUtil.getCurrentUser();
  return currentUser.getIdentifier();
};

const createImage = (file) => {
  const repository = resourceLocatorUtil.getLocalImageRepository();
  const image = imageUtil.createImageFromTemporary(repository, file);
  return image.getIdentifier();
};

const setContactInfo = (email, name, phoneNumber) => {
  const userId = getCurrentUserId();
  const contactInfo = {
    email: email,
    name: name,
    phoneNumber: phoneNumber,
  };
  dataStoreProvider.setContactInfo(userId, contactInfo);
  return contactInfo;
};

const renderItemImages = (items) => {
  items.forEach((item) => {
    const node = resourceLocatorUtil.getNodeByIdentifier(item.imageId);
    const imageScaler = utils.getImageScaler(200, 200);
    imageRenderer.setImageScaler(imageScaler);
    imageRenderer.clearSourceSetMode();
    imageRenderer.update(node);
    imageRenderer.forceUseImageScaler();
    item.image = imageRenderer.render();
  });
};

const removeImage = (imageId) => {
  const node = resourceLocatorUtil.getNodeByIdentifier(imageId);
  trashcanUtil.moveNodeToTrashcan(node);
};

const getFontClassName = (configProperty) => {
  const fontTitleId = appData.get(configProperty);
  const node = resourceLocatorUtil.getNodeByIdentifier(fontTitleId);
  return properties.get(node, "selectorText");
};
