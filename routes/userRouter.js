const express = require('express');
const router = express.Router();
const { generateOtp, doSignup, doLogin } =require('../controller/authController')

/* user auth router */
router.post('/signup', generateOtp );
router.post('/otp',doSignup);
router.post('/login',doLogin)

module.exports = router;
