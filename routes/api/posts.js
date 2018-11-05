const express = require("express");
const router = express.Router();

// @route GET api/posts/test
// @desc Test de posts route
// @access Publiek
router.get("/test", (req, res) => res.json({ msg: "Posts werkt!" }));

module.exports = router;
