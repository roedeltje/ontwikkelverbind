const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Input Validation Laden
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Laad User model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Test de users route
// @access Publiek
router.get("/test", (req, res) => res.json({ msg: "Users werkt!" }));

// @route GET api/users/register
// @desc Registreer een Gebruiker
// @access Publiek
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email bestaat al";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Grootte
        r: "pg", //Rating
        d: "mm" // Standaard Afbeelding
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Login Gebruiker / Return JWT Token
// @access Publiek
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Vind Gebruiker met Email
  User.findOne({ email }).then(user => {
    // Check voor Gebruiker
    if (!user) {
      errors.email = "Gebruiker niet gevonden";
      return res.status(404).json(errors);
    }

    // Check Wachtwoord
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Gebruikersgegevens kloppen

        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Creëer JWT Payload

        // Token Toewijzen
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Wachtwoord is niet correct";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route GET api/users/current
// @desc Return huidige Gebruiker
// @access Privé
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
