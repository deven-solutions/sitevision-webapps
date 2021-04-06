define(function (require) {
  "use strict";

  const storage = require("storage");
  const items = storage.getCollectionDataStore("marketplace_items");
  const contacts = storage.getKeyValueDataStore("marketplace_contactinfo");
  const logUtil = require("LogUtil");
  const appData = require("appData");
  const portletContextUtil = require("PortletContextUtil");

  return {
    getContactInfo(userId) {
      try {
        return contacts.get(userId);
      } catch (e) {
        logUtil.error(e);
      }
    },
    setContactInfo(userId, contactInfo) {
      try {
        contacts.put(userId, contactInfo);
      } catch (e) {
        logUtil.error(e);
      }
    },
    getItems: (filterByUserId) => {
      const itemsLimit = Number(appData.get("itemsLimit"));
      const pageId = portletContextUtil.getCurrentPage().getIdentifier();
      try {
        let result;
        const pageQuery = "ds.analyzed.pageId:" + pageId;
        if (filterByUserId) {
          result = items.find(pageQuery + " AND ds.analyzed.userId:" + filterByUserId, itemsLimit);
        } else {
          result = items.find(pageQuery);
        }
        const data = result.toArray();
        data.forEach((item) => (item.id = item.dsid)); // Required by ListComponent
        return data;
      } catch (e) {
        logUtil.error(e);
      }
    },
    setItem: (id, item) => {
      try {
        const pageId = portletContextUtil.getCurrentPage().getIdentifier();
        item.pageId = pageId;
        const updatedItem = items.set(id, item);
        items.instantIndex(updatedItem.dsid);
        return updatedItem;
      } catch (e) {
        logUtil.error(e);
      }
    },
    removeItem: (id) => {
      try {
        const updatedItem = items.remove(id);
        items.instantIndex(updatedItem.dsid);
      } catch (e) {
        logUtil.error(e);
      }
    },
    createItem: (item) => {
      try {
        const pageId = portletContextUtil.getCurrentPage().getIdentifier();
        item.pageId = pageId;
        const data = items.add(item);
        items.instantIndex(data.dsid);
        return data.dsid;
      } catch (e) {
        logUtil.error(e);
      }
    },
    getItem: (id) => {
      try {
        const item = items.get(id);
        return item;
      } catch (e) {
        logUtil.error(e);
      }
    },
  };
});
