(function () {
  // overwrite default validate function
  window.validate = function () {
    const emailInput = document.querySelector("input[name=administratorEmail]");
    const itemsLimitInput = document.querySelector("input[name=itemsLimit]");
    const emailErrorText = this.$("#email-error-message").text();
    const itemsLimitErrorText = this.$("#limit-error-message").text();
    const validEmail = isValidEmail(emailInput.value);
    const validitemsLimit = isValidItemsLimit(itemsLimitInput.value);

    toggleValidationMessage(emailInput, validEmail, emailErrorText);
    toggleValidationMessage(
      itemsLimitInput,
      validitemsLimit,
      itemsLimitErrorText
    );

    return validEmail && validitemsLimit;
  };

  function toggleValidationMessage(inputElement, isValid, textErrorElement) {
    const inputElementHasErrorClass = this.$(inputElement)
      .parent()
      .hasClass("has-error");
    if (!isValid && !inputElementHasErrorClass) {
      this.$(inputElement)
        .parent()
        .addClass("has-error")
        .append('<p class="error-message">' + textErrorElement + "</p>")
        .closest(".panel-body")
        .addClass("highlight-flash");
    } else if (isValid && inputElementHasErrorClass) {
      const parent = this.$(inputElement).parent();
      parent.removeClass("has-error");
      parent.children(".error-message").remove();
    }
  }

  function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function isValidItemsLimit(itemsLimit) {
    return !Number.isNaN(itemsLimit) && itemsLimit > 0;
  }
})();
