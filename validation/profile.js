const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle moet tussen de 2 en 40 karakters zijn";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profiel Handle mag niet leeg zijn!";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Het status veld mag niet leeg zijn!";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Het vaardigheden veld mag niet leeg zijn!";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Is geen geldige URL!";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.website = "Is geen geldige youtube URL!";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Is geen geldige twitter URL!";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Is geen geldige facebook URL!";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Is geen geldige linkedin URL!";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Is geen geldige instagram URL!";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
