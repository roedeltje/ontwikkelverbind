const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "het school veld is verplicht";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "diploma veld is verplicht";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "het studie richting veld is verplicht";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "het vanaf datum veld is verplicht";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
