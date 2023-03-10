const express = require('express');
const router = express.Router();
const {doLogin} =require('../controller/adminController');

router.post('/login',doLogin);

module.exports = router;
