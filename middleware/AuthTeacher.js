const teacherModel = require('../models/teacherModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const secret_key = process.env.SECRET_KEY;

const verifyTeacherLogin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, secret_key, async (err, decoded) => {
               
                if (err) {
                    res.json({ status: false, message: "Permission not allowed" });
                } else {
                    
                    const teacher =await teacherModel.findOne({ _id:decoded.id})
                    if (teacher) {
                        res.teacherId = decoded.id
                         next()
                    } else {
                        console.log("err");
                        res.json({ status: false, message: "Admin not exists" });
                    }
                }
            });
        } else {
            res.json({ status: false, message: 'Token not provided' });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" })
    }
}

module.exports = { verifyTeacherLogin }