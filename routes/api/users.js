const express = require("express");
const router = express.Router();

// @route GET api/users/test
// @desc Test de users route
// @access Publiek
router.get("/test", (req, res) => res.json({ msg: "Users werkt!" }));

module.exports = router;
