define(function(require) {
  'use strict';

  const storage = require('storage');
  const items = storage.getCollectionDataStore('marketplace_items');
  const contacts = storage.getKeyValueDataStore('marketplace_contactinfo');
  const logUtil = require('LogUtil');
  const appData = require('appData');

  return {
    getContactInfo(email) {
      try {
        return contacts.get(email);
      } catch (e) {
        logUtil.error(e);
      }
    },
    setContactInfo(email, contactInfo) {
      try {
        contacts.put(email, contactInfo);
      } catch (e) {
        logUtil.error(e);
      }
    },
    getItems: (filterByUserEmail) => {
      const itemsLimit = Number(appData.get('itemsLimit'));
      try {
        let result;
        if (filterByUserEmail) {
          result = items.find('ds.analyzed.userMail:' + filterByUserEmail, itemsLimit);
        } else {
          result = items.find('*');
        }
        const data = result.toArray();
        return data;
      } catch (e) {
        logUtil.error(e);
      }
    },
    editItem: (id, item) => {
      try {
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
        const data = items.add(item);
        items.instantIndex(data.dsid);
      } catch (e) {
        logUtil.error(e);
      }
    },
    getItem: (id) => {
      try {
        const item = items.get(id);
        return item;
      } catch (e) {
        logUtil.error(e)
      }
    }
  };
});