const express = require('express');
const { doLogin, teacherAuth} = require('../controller/teacherController');
const { uploadCourseImage } = require('../middleware/image-upload');
const {addCourse,getCourse}=require('../controller/courseController');
const { verifyTeacherLogin } = require('../middleware/AuthTeacher');
const router = express.Router();


router.post('/login',doLogin);
router.get('/auth',teacherAuth);

// course 

router.post('/add-course', verifyTeacherLogin,uploadCourseImage,addCourse);
router.get('/course',verifyTeacherLogin,getCourse);



module.exports = router;