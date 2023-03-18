const express = require('express');
const router = express.Router();
const { doLogin, addTeacher, authAdmin, getAllTeachers, blockTeacher } =require('../controller/adminController');
const {verifyAdminLogin} = require('../middleware/AuthAdmin');


// auth admin

router.get('/auth', authAdmin)

//teacher routers
router.post('/login',doLogin);
router.post('/add-teacher', verifyAdminLogin,addTeacher);
router.get('/teacher',verifyAdminLogin,getAllTeachers);
router.get('/block-teacher/:teacherId',verifyAdminLogin,blockTeacher);


module.exports = router;
