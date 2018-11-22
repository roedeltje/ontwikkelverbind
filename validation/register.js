const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Naam moet tussen de 2 en 30 tekens zijn!";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Naam is verplicht";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is verplicht";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email adres is ongeldig";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Wachtwoord is verplicht";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Wachtwoord moet tussen de 6 en 30 tekens zijn!";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Wachtwoord bevestigen is verplicht";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Wachtwoorden moeten overeenkomen!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
