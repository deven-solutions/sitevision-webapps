define(function (require) {
  "use strict";

  const logUtil = require("LogUtil");
  const appData = require("appData");
  const resourceLocatorUtil = require('ResourceLocatorUtil');
  const outputUtil = require('OutputUtil');
  const properties = require("Properties");


  return {
    logNode(prefix, node) {
      logUtil.info(prefix + ' ' + outputUtil.getNodeInfoAsHTML(node));
    },
    getFontClassName(configProperty) {
      const fontTitleId = appData.get(configProperty);
      const repository = resourceLocatorUtil.getFontRepository();
      return this.getNodeProperty(repository, fontTitleId, "selectorText");
    },
    getNodeProperty(parentNode, nodeId, propertyName) {
      return this.whenNodeId(parentNode, nodeId, node => properties.get(node, propertyName));
    },
    whenNodeId(parentNode, id, callback) {
      const nodes = parentNode.getNodes();
      while (nodes.hasNext()) {
        const node = nodes.next();
        if (node.getIdentifier() === id) {
          return callback(node);
        }
      }
    }
  };
});
