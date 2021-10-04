const express = require('express');
const router = express.Router();
const postLogin = require('../../controllers/auth/postLogin');
const postSignup = require('../../controllers/auth/postSignup');
const getStore = require('../../controllers/store/getStore');

// middleware
const { jwtAuthenticate } = require("../../helpers/jwtHelpers");

router.post("/login", postLogin)
router.post("/signup", postSignup)
router.get("/store", jwtAuthenticate, getStore)

router.get("/heathz", (req, res) => { res.send("OK") })

module.exports = router;
