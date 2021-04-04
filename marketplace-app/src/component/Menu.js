define(function (require) {
  "use strict";

  const Component = require("Component");
  const template = require("/template/menu");

  return Component.extend({
    template,
    tagName: "nav",
    onRendered: function () {
      switch (this.state.route) {
        case "/create":
        case "/upload":
        case "/itemsLimitExceeded":
          this.$("#menu-create").addClass("env-nav__link--active");
          break;
        case "/userItems":
        case "/edit":
          this.$("#menu-user-items").addClass("env-nav__link--active");
          break;
        default:
          this.$("#menu-root").addClass("env-nav__link--active");
      }
    },
    filterState: ({ route }) => ({ route }),
  });
});
