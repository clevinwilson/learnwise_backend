const express = require('express');
const router = express.Router();
const { doLogin, addTeacher, authAdmin, getAllTeachers, blockTeacher, getAllUsers, blockUser, unBlockUser, unBlockTeacher, getAllCourse, getAllCommunity, getAllGroups, changeCommunityStatus, changeCourseStatus, changeGroupStatus, getDashboardDetails } =require('../controller/adminController');
const {verifyAdminLogin} = require('../middleware/AuthAdmin');
const paginatedResults =require('../middleware/paginatedResults')


// auth admin

router.get('/auth', authAdmin)

//teacher routers
router.post('/login',doLogin);
router.post('/add-teacher', verifyAdminLogin,addTeacher);
router.get('/teacher', verifyAdminLogin,paginatedResults(), getAllTeachers);
router.get('/block-teacher/:teacherId',verifyAdminLogin,blockTeacher);

//user management
router.get("/user",verifyAdminLogin,getAllUsers);
router.get('/block-user/:userId', verifyAdminLogin, blockUser);
router.get('/unblock-user/:userId',verifyAdminLogin,unBlockUser);
router.get('/unblock-teacher/:teacherId', verifyAdminLogin, unBlockTeacher);

//course
router.get('/course',verifyAdminLogin,paginatedResults(),getAllCourse);
router.get('/course/change-status/:courseId/:status',verifyAdminLogin,changeCourseStatus)

//community
router.get('/community', verifyAdminLogin, paginatedResults(),getAllCommunity);
router.get('/community/change-status/:id/:status',verifyAdminLogin,changeCommunityStatus)

//groups
router.get('/group',verifyAdminLogin,paginatedResults() ,getAllGroups);
router.get('/group/change-status/:id/:status',verifyAdminLogin,changeGroupStatus);

//dashboard
router.get('/dashboard',verifyAdminLogin,getDashboardDetails)




module.exports = router;
