const express = require('express');
const router = express.Router();
const { generateOtp, doSignup, doLogin, googleAuth, googleAuthFaild } =require('../controller/authController')
const passport = require('passport');




/* user auth router */
router.post('/signup', generateOtp );
router.post('/otp',doSignup);
router.post('/login',doLogin);

//google auth
router.post('/login/google', googleAuth);

module.exports = router;
