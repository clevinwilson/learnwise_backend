const express = require('express');
const router = express.Router();
const { generateOtp, doSignup, doLogin, googleAuth, userAuthentication } = require('../controller/authController');
const { createCommunity, getAllCommunity, joinCommunity, getJoinedCommunit, getCommunityDetails, createCommunityPost, getCommunityFeeds, getCommunityMembers, editCommunity, leaveFromCommunity, deleteCommunity } = require('../controller/communityController');
const { getTopCourse, getCourseDetails, getAllCourses, getEnrolledCourse, isCourseEnrolled, search, getCourseFullDetails } = require('../controller/courseController');
const { doPayment, verifyPayment, cancelOrder } = require('../controller/paymentController');
const { verifyLogin } = require('../middleware/AuthUser');
const {uploadImage } = require('../middleware/image-upload');
const { createGroup, getCommunityGroups, joinGroup, getJoinedGroups, getAllGroups, exitGroup } = require('../controller/groupController');
const { createMessage, getMessages } = require('../controller/messageController');
const { getUserDetails, updateUserProfile, updateUserAvatar } = require('../controller/userController');
const { checkUserEnrolledCourse } = require('../middleware/checkCourseEnrolled');





/* user auth router */
router.post('/signup', generateOtp);
router.post('/otp', doSignup);
router.post('/login', doLogin);

// user authentication
router.get('/user-authenticate', userAuthentication)

//google auth router
router.post('/login/google', googleAuth);

//course router
router.get('/top-course', getTopCourse);
router.get('/course-details/:courseId',getCourseDetails);
router.get('/course', getAllCourses);
router.get('/is-course-enrolled/:courseId', verifyLogin, isCourseEnrolled);
router.get('/course/learn/:courseId', verifyLogin, checkUserEnrolledCourse, getCourseFullDetails)

///enrolled course
router.get('/enrolled-course', verifyLogin, getEnrolledCourse);


//payment
router.get('/verifyPayment/:orderId', verifyPayment);
router.post('/create-checkout-session', verifyLogin, doPayment);
router.get('/cancel-payment/:orderId', cancelOrder);

//search
router.get('/search', search);

//community
router.post('/create-community', verifyLogin, uploadImage("./public/images/community"), createCommunity);
router.get('/community', getAllCommunity);
router.put('/join-community', verifyLogin, joinCommunity);
router.get('/joined-community', verifyLogin, getJoinedCommunit);
router.get('/community-details/:communityId', verifyLogin, getCommunityDetails);
router.post('/create-community/post', verifyLogin, uploadImage('./public/images/post'), createCommunityPost);
router.get('/community/feeds/:communityId', verifyLogin, getCommunityFeeds);
router.get('/community/members/:communityId', verifyLogin, getCommunityMembers);
router.post('/edit-community', verifyLogin, uploadImage("./public/images/community"), editCommunity);
router.get('/community/leave/:communityId', verifyLogin, leaveFromCommunity);
router.get('/commuinty/delete/:communityId', verifyLogin, deleteCommunity)

//group
router.post('/create-group', verifyLogin, uploadImage('./public/images/group'), createGroup);
router.get('/community/groups/:communityId', verifyLogin, getCommunityGroups);
router.get('/community/groups/join/:communityId/:groupId', verifyLogin, joinGroup);
router.get('/community/group/joinedGroups/',verifyLogin,getJoinedGroups);
router.get('/community/groups',verifyLogin,getAllGroups);
router.get('/community/groups/exit/:groupId',verifyLogin,exitGroup);

//message
router.post('/messages',verifyLogin,createMessage);
router.get('/messages/:groupId',verifyLogin,getMessages);

//pagination
router.get('/listing');

//account 
router.get('/account',verifyLogin,getUserDetails);
router.patch('/update-profile',verifyLogin,updateUserProfile)
router.patch('/update-avatar', verifyLogin, uploadImage("./public/images/user"),updateUserAvatar)



module.exports = router;
