const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "titel veld is verplicht";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "bedrijf veld is verplicht";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "het vanaf datum veld is verplicht";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
