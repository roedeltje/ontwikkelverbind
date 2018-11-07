const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Validation Profiel Laden
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Laad Profiel Model
const Profile = require("../../models/Profile");
// Laad Gebruiker Profiel
const User = require("../../models/User");

// @route GET api/profile/test
// @desc Test de profile route
// @access Publiek
router.get("/test", (req, res) => res.json({ msg: "Profile werkt!" }));

// @route GET api/profile
// @desc Get huidige gebuikers profiel
// @access Privé
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Er is geen profiel voor deze gebruiker!";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route Get api/profile/all
// @desc Get alle profielen
// @access Publiek
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "Er zijn geen profielen om te tonen";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: "Er zijn geen profielen om te tonen" })
    );
});

// @route Get api/profile/handle/:handle
// @desc Get Profiel met Handle
// @access Publiek

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Er is geen profiel voor deze gebruiker";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route Get api/profile/user/:user_id
// @desc Get Profiel met User ID
// @access Publiek

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Er is geen profiel voor deze gebruiker";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: "Er is geen profiel voor deze gebruiker" })
    );
});

// @route POST api/profile
// @desc Creëer of Bewerk gebruikers Profiel
// @access Privé
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return errors met een 400 status
      return res.status(400).json(errors);
    }

    // Get Velden
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills- Splitsen in een Array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Creëer

        // Check of de handle bestaat
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Deze handle bestaat al";
            res.status(400).json(errors);
          }

          // Profiel Opslaan
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profile/experience
// @desc Voeg ervaring aan profiel toe
// @access Privé
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return errors met een 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Toevoegen aan Exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route POST api/profile/education
// @desc Voeg studie aan profiel toe
// @access Privé
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return errors met een 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Toevoegen aan Exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Ervaring van het profiel verwijderen
// @access Privé
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Opslaan
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Educatie van het profiel verwijderen
// @access Privé
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Opslaan
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile
// @desc Gebruiker en Profiel verwijderen
// @access Privé
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
