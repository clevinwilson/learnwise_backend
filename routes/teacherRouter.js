const express = require('express');
const { doLogin, teacherAuth, changePassword, getDashboardDetails } = require('../controller/teacherController');
const { uploadCourseImage } = require('../middleware/image-upload');
const { addCourse, getCourse, deleteCourse, getCourseDetailsForTeacher, EditCourseDetails }=require('../controller/courseController');
const { verifyTeacherLogin } = require('../middleware/AuthTeacher');
const router = express.Router();


router.post('/login',doLogin);
router.get('/auth',teacherAuth);

// course 
router.post('/add-course', verifyTeacherLogin,uploadCourseImage,addCourse);
router.get('/course',verifyTeacherLogin,getCourse);
router.delete('/delete-course/:courseId', verifyTeacherLogin, deleteCourse);
router.get('/course-details/:courseId',verifyTeacherLogin,getCourseDetailsForTeacher);
router.put('/update-course',verifyTeacherLogin,uploadCourseImage,EditCourseDetails);

//change password
router.put('/change-password',verifyTeacherLogin,changePassword);

//dashboard
router.get('/dashboard', verifyTeacherLogin, getDashboardDetails);




module.exports = router;