const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Berichten Model
const Post = require("../../models/Post");

// Profiel Model
const Profile = require("../../models/Profile");

// Validatie
const validatePostInput = require("../../validation/post");

// @route GET api/posts/test
// @desc Test de posts route
// @access Publiek
router.get("/test", (req, res) => res.json({ msg: "Posts werkt!" }));

// @route GET api/posts
// @desc GET alle geplaatste berichten
// @access Publiek
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostsfound: "Geen berichten gevonden" })
    );
});

// @route GET api/posts/:id
// @desc GET enkel bericht door id
// @access Publiek
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res
        .status(404)
        .json({ nopostfound: "Geen berichten met deze id gevonden" })
    );
});

// @route POST api/posts
// @desc Creëer Berichten op de tijdlijn
// @access Privé
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validatie
    if (!isValid) {
      // Bij errors, stuur 400 met errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route DELETE api/posts/:id
// @desc  Verwijder bericht dmv id
// @access Privé
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check bericht eigenaar
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "Geen rechten om bericht te verwijderen!"
            });
          }

          // Verwijderen
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Geen bericht gevonden" })
        );
    });
  }
);

// @route POST api/posts/like/:id
// @desc  Een bericht leuk vinden
// @access Privé
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "Heeft gebruiker al leuk gevonden" });
          }

          // Voeg gebruikers id toe aan likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Geen bericht gevonden" })
        );
    });
  }
);

// @route POST api/posts/unlike/:id
// @desc  Een bericht niet meer leuk vinden
// @access Privé
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "Je hebt dit nog niet leuk gevonden" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString)
            .indexOf(req.user.id);

          // Splice uit het array
          post.likes.splice(removeIndex, 1);

          // Opslaan
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Bericht niet gevonden"
          })
        );
    });
  }
);

// @route POST api/posts/comment/:id
// @desc  Reactie op een bericht geven
// @access Privé
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validatie
    if (!isValid) {
      // Bij errors, stuur 400 met errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Voeg toe aan comments array
        post.comments.unshift(newComment);

        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "Geen bericht gevonden" })
      );
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc  Reactie op een bericht verwijderen
// @access Privé
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check of de reactie bestaat
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "reactie bestaat niet" });
        }

        // Get de juiste reactie om te verwijderen (remove index)
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice reactie uit het array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "Geen bericht gevonden" })
      );
  }
);

module.exports = router;
