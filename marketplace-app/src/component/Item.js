define(function (require) {
  "use strict";

  const Component = require("Component");
  const template = require("/template/item");
  const requester = require("requester");
  const router = require("router");
  const i18n = require("i18n");

  return Component.extend({
    template,
    tagName: "tr",
    onRendered: function () {
      const modalBtn = document.getElementById(
        "report-modal-btn-" + this.state.id
      );
      modalBtn.addEventListener("click", () => {
        const subjectPart1 = i18n.get("mailSubjectPart1");
        const subjectPart2 = i18n.get("mailSubjectPart2");
        const text = document.getElementById(
          "report-modal-text-" + this.state.id
        ).value;
        requester
          .doPost({
            url: router.getUrl("/report"),
            data: {
              subject: subjectPart1 + this.state.title + subjectPart2,
              text: text,
            },
          })
          .done((res) => {
            if (!res.mailSent) {
              alert(i18n.get("mailNotSent"));
            }
          });
      });
    },
    filterState: function (state, options) {
      const item = state.items.find((ad) => ad.id === options.id);
      return Object.assign({}, item);
    },
  });
});
