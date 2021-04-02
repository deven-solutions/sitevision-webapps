(function() {
  // overwrite default validate function
  window.validate = function() {
     const emailInput = document.querySelector('input[name=administratorEmail]');
     const adsLimitInput = document.querySelector('input[name=adsLimit]');
     const emailErrorText = this.$('#email-error-message').text();
     const adsLimitErrorText = this.$('#limit-error-message').text();
     const validEmail = isValidEmail(emailInput.value);
     const validAdsLimit = isValidAdsLimit(adsLimitInput.value);

     toggleValidationMessage(emailInput, validEmail, emailErrorText);
     toggleValidationMessage(adsLimitInput, validAdsLimit, adsLimitErrorText);
     
     return validEmail && validAdsLimit;
  };

  function toggleValidationMessage(inputElement, isValid, textErrorElement) {
    const inputElementHasErrorClass = this.$(inputElement).parent().hasClass('has-error');
    if (!isValid && !inputElementHasErrorClass) {
      this.$(inputElement)
        .parent()
        .addClass('has-error')
        .append('<p class="error-message">' + textErrorElement + '</p>')
        .closest('.panel-body')
        .addClass('highlight-flash');
     } else if (isValid && inputElementHasErrorClass) {
      const parent = this.$(inputElement).parent();
      parent.removeClass('has-error');
      parent.children('.error-message').remove();
     }
  }

  function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function isValidAdsLimit(adsLimit) {
    return !Number.isNaN(adsLimit) && adsLimit > 0;
  }

}());