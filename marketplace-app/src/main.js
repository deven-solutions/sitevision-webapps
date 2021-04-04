define(function (require) {
  "use strict";

  const Component = require("Component");
  const itemsTemplate = require("/template/items");
  const createTemplate = require("/template/create");
  const editTemplate = require("/template/edit");
  const userItemsTemplate = require("/template/userItems");
  const itemsLimitExceededTemplate = require("/template/itemsLimitExceeded");
  const uploadTemplate = require("/template/upload");

  return Component.extend({
    getTemplate: function () {
      switch (this.state.route) {
        case "/create":
          return createTemplate;
        case "/upload":
          return uploadTemplate;
        case "/edit":
          return editTemplate;
        case "/userItems":
          return userItemsTemplate;
        case "/itemsLimitExceeded":
          return itemsLimitExceededTemplate;
        default:
          return itemsTemplate;
      }
    },
    className: "webapp-marketplace",
    filterState: ({ route }) => ({ route }),
  });
});
