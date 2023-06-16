const express = require('express');
const { doLogin, teacherAuth, changePassword, getDashboardDetails, updatePhoto, updateAbout } = require('../controller/teacherController');
const { uploadImage } = require('../middleware/image-upload');
const { addCourse, getCourse, deleteCourse, getCourseDetailsForTeacher, EditCourseDetails }=require('../controller/courseController');
const { verifyTeacherLogin } = require('../middleware/AuthTeacher');
const router = express.Router();


router.post('/login',doLogin);
router.get('/auth',teacherAuth);

// course 
router.post('/add-course', verifyTeacherLogin, uploadImage('./public/images/course/thumbnail'),addCourse);
router.get('/course',verifyTeacherLogin,getCourse);
router.delete('/delete-course/:courseId', verifyTeacherLogin, deleteCourse);
router.get('/course-details/:courseId',verifyTeacherLogin,getCourseDetailsForTeacher);
router.put('/update-course', verifyTeacherLogin, uploadImage('./public/images/course/thumbnail'),EditCourseDetails);

//change password
router.put('/change-password',verifyTeacherLogin,changePassword);

//dashboard
router.get('/dashboard', verifyTeacherLogin, getDashboardDetails);

//update teacher photo
router.put('/update-photo', verifyTeacherLogin, uploadImage('./public/images/teacher/') ,updatePhoto);

//update teacher about
router.put('/update-about',verifyTeacherLogin,updateAbout);




module.exports = router;