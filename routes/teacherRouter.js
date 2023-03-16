const express = require('express');
const { doLogin, teacherAuth} = require('../controller/teacherController');
const { uploadCourseImage } = require('../middleware/image-upload');
const {addCourse}=require('../controller/courseController')
const router = express.Router();


router.post('/login',doLogin);
router.get('/auth',teacherAuth);

// course 

router.post('/add-course',uploadCourseImage,addCourse)



module.exports = router;