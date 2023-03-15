const express = require('express');
const { doLogin, teacherAuth } = require('../controller/TeacherController');
const router = express.Router();


router.post('/login',doLogin);
router.get('/auth',teacherAuth)



module.exports = router;