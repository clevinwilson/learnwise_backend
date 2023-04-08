const express = require('express');
const router = express.Router();
const { doLogin, addTeacher, authAdmin, getAllTeachers, blockTeacher, getAllUsers, blockUser, unBlockUser, unBlockTeacher, getAllCourse, getAllCommunity, getAllGroups } =require('../controller/adminController');
const {verifyAdminLogin} = require('../middleware/AuthAdmin');


// auth admin

router.get('/auth', authAdmin)

//teacher routers
router.post('/login',doLogin);
router.post('/add-teacher', verifyAdminLogin,addTeacher);
router.get('/teacher',verifyAdminLogin,getAllTeachers);
router.get('/block-teacher/:teacherId',verifyAdminLogin,blockTeacher);

//user management
router.get("/user",verifyAdminLogin,getAllUsers);
router.get('/block-user/:userId', verifyAdminLogin, blockUser);
router.get('/unblock-user/:userId',verifyAdminLogin,unBlockUser);
router.get('/unblock-teacher/:teacherId', verifyAdminLogin, unBlockTeacher);

//course
router.get('/course',verifyAdminLogin,getAllCourse);

//community
router.get('/community',verifyAdminLogin,getAllCommunity);

//groups
router.get('/group',verifyAdminLogin,getAllGroups)




module.exports = router;
