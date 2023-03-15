const express = require('express');
const router = express.Router();
const { doLogin, addTeacher, authAdmin } =require('../controller/adminController');
const {verifyAdminLogin} = require('../middleware/AuthAdmin');


// auth admin

router.get('/auth', authAdmin)

router.post('/login',doLogin);
router.post('/add-teacher', verifyAdminLogin,addTeacher);

module.exports = router;
