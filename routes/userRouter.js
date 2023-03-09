const express = require('express');
const router = express.Router();
const {generateOtp,doSignup} =require('../controller/authController')

/* GET users listing. */
router.post('/signup', generateOtp );

module.exports = router;
