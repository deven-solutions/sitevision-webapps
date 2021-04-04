define(function (require) {
  "use strict";

  const Component = require("Component");
  const template = require("/template/item");
  const requester = require("requester");
  const router = require("router");

  return Component.extend({
    template,
    tagName: "tr",
    onRendered: function () {
      const modalBtn = document.getElementById(
        "report-modal-btn-" + this.state.id
      );
      modalBtn.addEventListener("click", () => {
        const subjectPart1 = document.getElementById("i18-mailSubjectPart1")
          .textContent;
        const subjectPart2 = document.getElementById("i18-mailSubjectPart2")
          .textContent;
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
              alert(document.getElementById("i18-mailNotSent").textContent);
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
