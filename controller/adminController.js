const Admin = require('../models/adminModel')
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const secret_key = process.env.SECRET_KEY;
const { sendEmail } = require('../helpers/sendEmail');
const Teacher = require('../models/teacherModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const Community = require('../models/communityModel');
const Group = require('../models/groupModel');
const Order = require('../models/orderModel');


const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}



const doLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (admin) {
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
            const token = createTocken(admin._id);
            res.cookie("jwt", token, {
                withCredential: true,
                httpOnly: false,
                maxAge: maxAge * 1000
            })
            admin.password = "empty"
            res.status(200).json({ admin, token, login: true });
        } else {
            res.json({ login: false, message: "Incorrect username or password" });
        }

    } else {
        res.json({ message: "Email not exists", login: false })
    }
}

const addTeacher = async (req, res) => {
    const { firstName, lastName, email, phone, place } = req.body;
    const randomNum = Math.floor(Math.random() * 1000000);
    const password = randomNum.toString().padStart(6, '0');

    const teacher = await Teacher.findOne({ email: email });
    if (!teacher) {
        const newTeacher = new Teacher({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
            place: place
        })
        newTeacher.save()
            .then(async (data) => {
                const emailSend = await sendEmail(email, password)
                if (emailSend.status) {
                    res.json({ created: true, message: "Teacher Details added successfully" });
                }
                else {

                    res.json({ created: false, message: "Email Not Send" });
                }

            })
            .catch((err) => {
                console.log(err);
                res.json({ created: false, message: "Error" });
            })
    } else {
        res.json({ created: false, message: "Teacher already exists" });
    }
}



const authAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secret_key, async (err, decoded) => {
            // console.log(decoded.iat);

            if (err) {
                res.json({ status: false, message: "Unauthorized" });
            } else {
                const admin = Admin.findById({ _id: decoded.id });
                if (admin) {
                    res.json({ status: true, message: "Authorized" });

                } else {
                    res.json({ status: false, message: "Admin not exists" })
                }
            }
        });
    } else {
        res.json({ status: false, message: 'Token not provided' })
    }
}


const getAllTeachers = (req, res) => {
    try {
        Teacher.find({}, { password: 0 }).skip(req.paginatedResults.startIndex).limit(req.paginatedResults.endIndex).then((response) => {
            res.status(200).json({ status: true, teachers: response,pagination:req.paginatedResults })
        })
    } catch (err) {
        res.status(500).json({ created: false, message: "Internal server error" })

    }
}

const blockTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ _id: req.params.teacherId });
        if (teacher) {
            Teacher.updateOne({ _id: req.params.teacherId }, {
                $set: {
                    status: false
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "Teacher Blocked Successfully" });
            }).catch((err) => {
                res.status(500).json({ status: false, message: "Internal server error" });
            })
        } else {
            res.status(404).json({ status: false, message: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (users) {
            res.status(200).json({ status: true, users })
        } else {
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}


const blockUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        if (user) {
            User.updateOne({ _id: req.params.userId }, {
                $set: {
                    status: false
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "User Blocked Successfully" });
            }).catch((err) => {
                res.status(500).json({ status: false, message: "Internal server error" });
            })
        } else {
            res.status(404).json({ status: false, message: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}



const unBlockUser = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.params.userId });
        if (user) {
            User.updateOne({ _id: req.params.userId }, {
                $set: {
                    status: true
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "User Blocked Successfully" });
            }).catch((err) => {
                res.status(500).json({ status: false, message: "Internal server error" });
            })
        } else {
            res.status(404).json({ status: false, message: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const unBlockTeacher = async (req, res) => {
    try {
        const user = await Teacher.findOne({ _id: req.params.teacherId });
        if (user) {
            Teacher.updateOne({ _id: req.params.teacherId }, {
                $set: {
                    status: true
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "User Blocked Successfully" });
            }).catch((err) => {
                res.status(500).json({ status: false, message: "Internal server error" });
            })
        } else {
            res.status(404).json({ status: false, message: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

//get all course list 
const getAllCourse = async (req, res) => {
    try {
        const course = await Course.find().populate({ path: "teacher", select: "firstName" });
        if (course) {
            res.status(200).json({ status: true, course, pagination: req.paginatedResults })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}


const changeCourseStatus = async (req, res) => {
    try {
        switch (req.params.status) {
            case 'block':
                Course.updateOne({ _id: req.params.courseId }, { $set: { status: false } })
                    .then((response) => {
                        res.status(200).json({ status: true, message: "Course Blocked Successfully" });
                    })

                break;
            case 'unblock':
                Course.updateOne({ _id: req.params.courseId }, { $set: { status: true } }).then((response) => {
                    res.status(200).json({ status: true, message: "Course Unblocked Successfully" })
                })
                break;
            default:
                res.status(200).json({ status: true, message: "Invalid" })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}


//get all community list
const getAllCommunity = async (req, res) => {
    try {
        const community = await Community.find();
        if (community) {
            res.status(200).json({ status: true, community, pagination: req.paginatedResults })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

const changeCommunityStatus = async (req, res) => {
    try {
        switch (req.params.status) {
            case 'block':
                Community.updateOne({ _id: req.params.id }, { $set: { status: false } })
                    .then((response) => {
                        res.status(200).json({ status: true, message: "Community Blocked Successfully" });
                    })

                break;
            case 'unblock':
                Community.updateOne({ _id: req.params.id }, { $set: { status: true } }).then((response) => {
                    res.status(200).json({ status: true, message: "Community Unblocked Successfully" })
                })
                break;
            default:
                res.status(200).json({ status: true, message: "Invalid" })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}


//get all groups details
const getAllGroups = async (req, res) => {
    try {
        const group = await Group.find();
        if (group) {
            res.status(200).json({ status: true, group, pagination: req.paginatedResults })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

const changeGroupStatus = async(req,res)=>{
    try {
        switch (req.params.status) {
            case 'block':
                Group.updateOne({ _id: req.params.id }, { $set: { status: false } })
                    .then((response) => {
                        res.status(200).json({ status: true, message: "Group Blocked Successfully" });
                    })

                break;
            case 'unblock':
                Group.updateOne({ _id: req.params.id }, { $set: { status: true } }).then((response) => {
                    res.status(200).json({ status: true, message: "Group Unblocked Successfully" })
                })
                break;
            default:
                res.status(200).json({ status: true, message: "Invalid" })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

const getDashboardDetails=async(req,res)=>{
    try{
        let studentCount=await User.find().count();
        let teacherCount=await Teacher.find().count();
        let courseCount=await Course.find().count();
        let communityCount=await Community.find().count();

        //get sudent details based on joined month
        let studentJoinedDetails = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                } 
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                }
            },
            {
                $sort: { month: 1 }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    data: 1
                }
            }
        ]);

        
        let totalOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$course" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({ studentCount, teacherCount, courseCount, communityCount, studentJoinedDetails: studentJoinedDetails[0].data, orderCount: totalOrders[0].count })
    } catch (err) {
        console.log(err);
        res.status(404).json({ status: false, message: err.message });
    }
}

module.exports = { doLogin, addTeacher, authAdmin, getAllTeachers, blockTeacher, getAllUsers, blockUser, unBlockUser, unBlockTeacher, getAllCourse, getAllCommunity, getAllGroups, changeCommunityStatus, changeCourseStatus, changeGroupStatus, getDashboardDetails }