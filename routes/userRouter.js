const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const { generateOtp, doSignup, doLogin, googleAuth, userAuthentication } =require('../controller/authController');
const { getTopCourse, getCourseDetails } = require('../controller/courseController');
const { doPayment, verifyPayment, cancelOrder } = require('../controller/paymentController');
const { verifyLogin } = require('../middleware/AuthUser');





/* user auth router */
router.post('/signup', generateOtp );
router.post('/otp',doSignup);
router.post('/login',doLogin);

// user authentication
router.get('/user-authenticate',userAuthentication)

//google auth router
router.post('/login/google', googleAuth);

//course router
router.get('/top-course',getTopCourse);
router.get('/course-details/:courseId',getCourseDetails);





//payment
router.get('/verifyPayment/:orderId',verifyPayment)
router.post('/create-checkout-session',doPayment);
router.get('/cancel-payment/:orderId',cancelOrder)






module.exports = router;
