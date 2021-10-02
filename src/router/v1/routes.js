const express = require('express');
const router = express.Router();
const postLogin = require('../../controllers/auth/postLogin');
const postSignup = require('../../controllers/auth/postSignup');

router.post("/login", postLogin)
router.post("/signup", postSignup)

router.get("/heathz", (req, res) => { res.send("OK") })

module.exports = router;
