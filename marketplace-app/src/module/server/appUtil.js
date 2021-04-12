define(function (require) {
  "use strict";

  const logUtil = require("LogUtil");
  const appData = require("appData");
  const resourceLocatorUtil = require('ResourceLocatorUtil');
  const outputUtil = require('OutputUtil');
  const properties = require("Properties");
  const trashcanUtil = require("TrashcanUtil");

  function getNodeProperty(parentNode, nodeId, propertyName) {
    return whenNodeId(parentNode, nodeId, node => properties.get(node, propertyName));
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

  return {
    removeImage(imageId) {
      const imageRepository = resourceLocatorUtil.getLocalImageRepository();
      whenNodeId(imageRepository, imageId, node => trashcanUtil.moveNodeToTrashcan(node));
    },
    getFontClassName(configProperty) {
      const fontTitleId = appData.get(configProperty);
      const repository = resourceLocatorUtil.getFontRepository();
      return getNodeProperty(repository, fontTitleId, "selectorText");
    },
    logNode(prefix, node) {
      logUtil.info(prefix + ' ' + outputUtil.getNodeInfoAsHTML(node));
    }
  };
});
