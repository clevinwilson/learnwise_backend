const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherModel');
const secret_key = process.env.SECRET_KEY;
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Course = require('../models/courseModel');
const { response } = require('express');

const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}

//teacher login
const doLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const teacher = await Teacher.findOne({ email: email });
        if (teacher) {
            const validPassword = await bcrypt.compare(password, teacher.password);
            if (validPassword) {
                const token = createTocken(teacher._id);
                teacher.password = "empty"
                res.status(200).json({ teacher, token, login: true });
            } else {
                res.json({ login: false, message: "Incorrect username or password" });
            }
        } else {
            res.json({ message: "Email not exists", login: false })
        }
    } catch (err) {
        res.status(500).json({ serverError: true, message: "Internal server error" })
    }
}



//checking teacher login or not
const teacherAuth = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, secret_key, async (err, decoded) => {
                // console.log(decoded.iat);

                if (err) {
                    res.json({ status: false, message: "Permission not allowed" });
                } else {
                    const teacher = Teacher.findById({ _id: decoded.id, status: true });
                    if (teacher) {
                        res.json({ status: true, message: "Authorized" })
                    } else {
                        res.json({ status: false, message: "teacher not exists" });
                    }
                }
            });
        } else {
            res.json({ status: false, message: 'Token not provided' });
        }
    } catch (err) {
        res.status(500).json({ serverError: true, message: "Internal server error" })
    }
}


//teacher change password
const changePassword = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ _id: res.teacherId });
        if (teacher) {
            const validPassword = await bcrypt.compare(req.body.oldpassword, teacher.password);
            if (validPassword) {
                const newPassword = await bcrypt.hash(req.body.password, 10);
                Teacher.updateOne({ _id: res.teacherId }, {
                    $set: {
                        password: newPassword
                    }
                }).then(() => {
                    res.status(200).json({ status: true, message: "Password updated successfully" });
                })
            } else {
                throw new Error("Incorrect old password. please retry")
            }
        } else {
            throw new Error("Teacher Not exist")
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
}


//geting dashboard details for teacher
const getDashboardDetails = async (req, res) => {
    try {
        let studentCount = await User.find().count();
        let orderCount = await Order.find({ teacher: res.teacherId }).count();
        let courseCount = await Course.find({ teacher: res.teacherId }).count();

        //get sudent details based on joined month
        let revenueDetails = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$purchase_date" },
                    total: { $sum: '$total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    total: 1
                }
            },
            {
                $sort: { month: 1 }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: "$total" }
                }
            },
            {
                $project: {
                    _id: 0,
                    data: 1
                }
            }
        ]);
        res.status(200).json({ studentCount, orderCount, courseCount, revenueDetails: revenueDetails[0].data });
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

//uploading teacher photo
const updatePhoto = async (req, res, next) => {
    try {
        //checking teacher exist or not 
        if (req.files) {
            let teacher = await Teacher.findOne({ _id: res.teacherId });
            if (teacher) {
                let image = req.files.image[0].path.replace('public/', "");
                console.log(image);
                Teacher.updateOne({ _id: res.teacherId }, {
                    $set: { picture: image }
                }).then((response) => {
                    res.status(200).json({ status: true, message: "Image uploaded" })
                })
            } else {
                throw new Error("Image is required");
            }
        } else {
            throw new Error("Teacher Not exist");
        }
    } catch (error) {
        next(error)

    }
}

const updateAbout = async (req, res, next) => {
    try {
        //checking teacher exist or not 
        let teacher = await Teacher.findOne({ _id: res.teacherId });
        if (teacher) {
            Teacher.updateOne({ _id: res.teacherId }, {
                $set: { about: req.body.about }
            }).then((response) => {
                res.status(200).json({ status: true, message: "About added" })
            })
        } else {
            throw new Error("Teacher Not exist")
        }
    } catch (error) {
        next(error)

    }
}






module.exports = { doLogin, teacherAuth, changePassword, getDashboardDetails, updatePhoto, updateAbout }