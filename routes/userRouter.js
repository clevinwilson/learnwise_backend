const express = require('express');
const router = express.Router();
const { generateOtp, doSignup, doLogin, googleAuth, googleAuthFaild } =require('../controller/authController')
const passport = require('passport');


/* user auth router */
router.post('/signup', generateOtp );
router.post('/otp',doSignup);
router.post('/login',doLogin);

//google auth
// router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }),googleAuth);
router.get('/login/failed',googleAuthFaild)

module.exports = router;
