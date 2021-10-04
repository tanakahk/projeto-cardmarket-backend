const express = require('express');
const router = express.Router();

// middleware
const { jwtAuthenticate } = require("../../helpers/jwtHelpers");

router.post("/login", require('../../controllers/auth/postLogin'))
router.post("/signup", require('../../controllers/auth/postSignup'))
router.get("/store", jwtAuthenticate, require('../../controllers/store/getSrInfo'))
router.get("/sr_info/:sr_id", jwtAuthenticate, require('../../controllers/store/getSrInfo'))

router.get("/heathz", (req, res) => { res.send("OK") })

module.exports = router;
