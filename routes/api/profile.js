const express = require("express");
const router = express.Router();

// @route GET api/profile/test
// @desc Test de profile route
// @access Publiek
router.get("/test", (req, res) => res.json({ msg: "Profile werkt!" }));

module.exports = router;
