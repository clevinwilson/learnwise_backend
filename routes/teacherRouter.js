const express = require('express');
const { doLogin } = require('../controller/TeacherController');
const router = express.Router();


router.post('/login',doLogin);



module.exports = router;