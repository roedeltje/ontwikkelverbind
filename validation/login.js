const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email adres is ongeldig";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is verplicht";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Wachtwoord is verplicht";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
