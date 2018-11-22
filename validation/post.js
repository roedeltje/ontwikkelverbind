const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Bericht moet tussen de 10 en 300 tekens lang zijn";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Tekst is verplicht";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
