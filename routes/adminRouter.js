const express = require('express');
const router = express.Router();
const { doLogin, addTeacher } =require('../controller/adminController');
const {verifyAdminLogin} = require('../middleware/AuthAdmin')


router.post('/login',doLogin);
router.post('/add-teacher', verifyAdminLogin,addTeacher)

module.exports = router;
