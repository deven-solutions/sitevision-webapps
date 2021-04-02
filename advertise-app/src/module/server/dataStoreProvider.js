define(function(require) {
  'use strict';

  const storage = require('storage');
  const advertises = storage.getCollectionDataStore('advertises');
  const logUtil = require('LogUtil');
  const appData = require('appData');

  return {
    getAdvertises: () => {
      const adsLimit = appData.get('adsLimit');
      const result = advertises.find('*', Number(adsLimit));
      try {
        const data = result.toArray();
        data.forEach(ad => ad.id = ad.dsid); // Always provide an "id" attribute for list items.
        return data;
      } catch (e) {
        logUtil.error(e);
      }
    },
    editAdvertise: (id, advertise) => {
      try {
        const updatedAdvertise = advertises.set(id, advertise);
        advertises.instantIndex(updatedAdvertise.dsid);
        return updatedAdvertise;
      } catch (e) {
        logUtil.error(e);
      }
    },
    removeAdvertise: (id) => {
      try {
        const updatedAdvertise = advertises.remove(id);
        advertises.instantIndex(updatedAdvertise.dsid);
      } catch (e) {
        logUtil.error(e);
      }
    },
    createAdvertise: (advertise) => {
      try {
        const data = advertises.add(advertise);
        advertises.instantIndex(data.dsid);
      } catch (e) {
        logUtil.error(e);
      }
    },
    getAdvertise: (id) => {
      try {
        const advertise = advertises.get(id);
        return advertise;
      } catch (e) {
        logUtil.error(e)
      }
    }
  };
});