const express = require('express');
const { routes } = require('../app');
const router = express.Router();
const { generateOtp, doSignup, doLogin, googleAuth, userAuthentication } =require('../controller/authController');
const { createCommunity } = require('../controller/communityController');
const { getTopCourse, getCourseDetails, getAllCourses, getEnrolledCourse, isCourseEnrolled, search } = require('../controller/courseController');
const { doPayment, verifyPayment, cancelOrder } = require('../controller/paymentController');
const { verifyLogin } = require('../middleware/AuthUser');
const { uploadCommuniyImage } = require('../middleware/image-upload');





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
router.get('/course',getAllCourses);
router.get('/is-course-enrolled/:courseId',verifyLogin,isCourseEnrolled);

///enrolled course
router.get('/enrolled-course',verifyLogin,getEnrolledCourse);


//payment
router.get('/verifyPayment/:orderId',verifyPayment);
router.post('/create-checkout-session',verifyLogin,doPayment);
router.get('/cancel-payment/:orderId',cancelOrder);

//search
router.get('/search',search);

//community
router.post('/create-community',verifyLogin, uploadCommuniyImage,createCommunity)





module.exports = router;
