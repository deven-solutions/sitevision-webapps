define(function(require) {
  'use strict';

  const storage = require('storage');
  const advertises = storage.getCollectionDataStore('advertises');
  const logUtil = require('LogUtil');
  const appData = require('appData');

  return {
    getAdvertises: (filterByUserEmail) => {
      const adsLimit = Number(appData.get('adsLimit'));
      try {
        let result;
        if (filterByUserEmail) {
          result = advertises.find('ds.analyzed.userMail:' + filterByUserEmail, adsLimit);
        } else {
          result = advertises.find('*');
        }
        const data = result.toArray();
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