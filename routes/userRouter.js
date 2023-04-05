const express = require('express');
const router = express.Router();
const { generateOtp, doSignup, doLogin, googleAuth, userAuthentication } =require('../controller/authController');
const { createCommunity, getAllCommunity, joinCommunity, getJoinedCommunit, getCommunityDetails, createCommunityPost, getCommunityFeeds, getCommunityMembers, editCommunity } = require('../controller/communityController');
const { getTopCourse, getCourseDetails, getAllCourses, getEnrolledCourse, isCourseEnrolled, search } = require('../controller/courseController');
const { doPayment, verifyPayment, cancelOrder } = require('../controller/paymentController');
const { verifyLogin } = require('../middleware/AuthUser');
const { uploadCommuniyImage, postImage, uploadGroupImage } = require('../middleware/image-upload');
const { createGroup, getCommunityGroups, joinGroup } = require('../controller/groupController');





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
router.post('/create-community',verifyLogin, uploadCommuniyImage,createCommunity);
router.get('/community',getAllCommunity);
router.put('/join-community',verifyLogin,joinCommunity);
router.get('/joined-community',verifyLogin,getJoinedCommunit);
router.get('/community-details/:communityId',verifyLogin,getCommunityDetails);
router.post('/create-communityPost',verifyLogin,postImage,createCommunityPost);
router.get('/community/feeds/:communityId',verifyLogin,getCommunityFeeds);
router.get('/community/members/:communityId',verifyLogin,getCommunityMembers);
router.post('/edit-community', verifyLogin, uploadCommuniyImage,editCommunity);

//group
router.post('/create-group', verifyLogin, uploadGroupImage,createGroup);
router.get('/community/groups/:communityId',verifyLogin,getCommunityGroups);
router.get('/community/groups/join/:communityId/:groupId',verifyLogin,joinGroup)




module.exports = router;
