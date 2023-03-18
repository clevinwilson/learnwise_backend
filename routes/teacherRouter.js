const express = require('express');
const { doLogin, teacherAuth} = require('../controller/teacherController');
const { uploadCourseImage } = require('../middleware/image-upload');
const { addCourse, getCourse, deleteCourse }=require('../controller/courseController');
const { verifyTeacherLogin } = require('../middleware/AuthTeacher');
const router = express.Router();


router.post('/login',doLogin);
router.get('/auth',teacherAuth);

// course 

router.post('/add-course', verifyTeacherLogin,uploadCourseImage,addCourse);
router.get('/course',verifyTeacherLogin,getCourse);
router.delete('/delete-course/:courseId', verifyTeacherLogin, deleteCourse)



module.exports = router;