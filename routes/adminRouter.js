const express = require('express');
const router = express.Router();
const { doLogin, addTeacher } =require('../controller/adminController');

router.post('/login',doLogin);
router.post('/add-teacher',addTeacher)

module.exports = router;
