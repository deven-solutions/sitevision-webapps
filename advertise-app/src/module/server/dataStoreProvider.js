define(function(require) {
  'use strict';

  const storage = require('storage');
  const advertises = storage.getCollectionDataStore('advertises');
  const logUtil = require('LogUtil');

  return {
    getAllAdvertises: () => {
      var result = advertises.find('*', 100);
      try {
        var data = result.toArray();
        return data;
      } catch (e) {
        logUtil.error(e);
      }
    },
    editAdvertise: (id, advertise) => {
      try {
        var updatedAdvertise = advertises.set(id, advertise);
        advertises.instantIndex(updatedAdvertise.dsid);
        return updatedAdvertise;
      } catch (e) {
        logUtil.error(e);
      }
    },
    removeAdvertise: (id) => {
      try {
        var updatedAdvertise = advertises.remove(id);
        advertises.instantIndex(updatedAdvertise.dsid);
      } catch (e) {
        logUtil.error(e);
      }
    },
    createAdvertise: (advertise) => {
      try {
        var data = advertises.add(advertise);
        advertises.instantIndex(data.dsid);
      } catch (e) {
        logUtil.error(e);
      }
    },
    getAdvertise: (id) => {
      try {
        var advertise = advertises.get(id);
        return advertise;
      } catch (e) {
        logUtil.error(e)
      }
    }
  };
});