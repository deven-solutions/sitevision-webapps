import storage from '@sitevision/api/server/storage';
import appData from '@sitevision/api/server/appData';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import logUtil from '@sitevision/api/server/LogUtil';

const items = storage.getCollectionDataStore("marketplace_items");
const contacts = storage.getKeyValueDataStore("marketplace_contactinfo");

export const getContactInfo = (userId) => {
  try {
    return contacts.get(userId);
  } catch (e) {
    logUtil.error(e);
  }
}

export const setContactInfo = (userId, contactInfo) => {
  try {
    contacts.put(userId, contactInfo);
  } catch (e) {
    logUtil.error(e);
  }
}

export const getItems = (userIdFilter) => {
  const itemsLimit = Number(appData.get("itemsLimit"));
  const pageId = portletContextUtil.getCurrentPage().getIdentifier();
  try {
    let result;
    const pageQuery = "ds.analyzed.pageId:" + pageId;
    if (userIdFilter) {
      result = items.find(
        pageQuery + " AND ds.analyzed.userId:" + userIdFilter,
        itemsLimit
      );
    } else {
      result = items.find(pageQuery);
    }
    return result.toArray();
  } catch (e) {
    logUtil.error(e);
  }
}

export const setItem = (id, item) => {
  try {
    const pageId = portletContextUtil.getCurrentPage().getIdentifier();
    item.pageId = pageId;
    const updatedItem = items.set(id, item);
    items.instantIndex(updatedItem.dsid);
    return updatedItem;
  } catch (e) {
    logUtil.error(e);
  }
}

export const removeItem = (id) => {
  try {
    const removedItem = items.remove(id);
    items.instantIndex(removedItem.dsid);
  } catch (e) {
    logUtil.error(e);
  }
}

export const createItem = (item) => {
  try {
    const pageId = portletContextUtil.getCurrentPage().getIdentifier();
    item.pageId = pageId;
    const data = items.add(item);
    items.instantIndex(data.dsid);
    return data.dsid;
  } catch (e) {
    logUtil.error(e);
  }
}

export const getItem = (id) => {
  try {
    const item = items.get(id);
    return item;
  } catch (e) {
    logUtil.error(e);
  }
}
