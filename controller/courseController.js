const { response } = require('express');
const { default: mongoose } = require('mongoose');
const courseModel = require('../models/courseModel');
const Course = require('../models/courseModel');
const orderModel = require('../models/orderModel');

const addCourse = async (req, res) => {
    try {
        req.files.image[0].path = req.files.image[0].path.replace('public\\', "");

        const newCourse = new Course({
            name: req.body.name,
            teacher: res.teacherId,
            category: req.body.category,
            duration: req.body.duration,
            language: req.body.language,
            about: "About Java",
            price: Number(req.body.price),
            description: req.body.description,
            image: req.files.image[0],
            course: req.body.course
        })

        return await newCourse.save()
            .then(() => {
                res.status(200).json({ status: true, message: "Course added Successfully" })
            }).catch((error) => {
                console.log(error);
                res.status(500).json({ status: true, message: "Internal server error" })
            })

    } catch (err) {
        res.status(500).json({ status: true, message: "Internal server error" });
    }
}


const getCourse = async (req, res) => {
    try {
        let course = await courseModel.find({ teacher: res.teacherId });
        if (course) {
            res.status(200).json({ status: true, course })
        }
    } catch (err) {
        res.status(500).json({ status: true, message: "Internal server error" });
    }

}

const deleteCourse = async (req, res) => {
    try {
        courseModel.findOneAndDelete({ teacher: res.teacherId, _id: req.params.courseId })
            .then((response) => {
                res.status(200).json({ status: true, message: "Course deleted successfully " })
            })
            .catch((error) => {

                res.status(500).json({ status: false, message: "Internal server error" });
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Internal server error" });

    }
}



// user
const getTopCourse = async (req, res) => {
    try {

        let course = await courseModel.find({ status: true }).populate('teacher').lean();

        if (course) {
            res.status(200).json({ status: true, courses: course })
        } else {
            res.status(500).json({ status: false, message: "Internal server error" });
        }

    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getCourseDetails = async (req, res) => {
    try {
        courseModel.findOne({ _id: req.params.courseId }, { 'course.lessons.videoUrl': 0, 'course.lessons._id': 0 }).populate('teacher').lean().then((response) => {
            res.status(200).json({ status: true, courseDetails: response });
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });

    }
}

const getAllCourses = async (req, res) => {
    try {
        courseModel.find({ status: true }).populate('teacher').lean().then((response) => {
            res.status(200).json({ status: true, course: response });

        }).catch((err) => {
            res.status(500).json({ status: false, message: "Internal server error" });

        })
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });

    }
}

const getEnrolledCourse = async (req, res) => {
    try {
        let enrolledCourse = await orderModel.find({ user: req.userId }).populate('teacher').populate('course')
        res.status(200).json({ status: true, enrolledCourse });

    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });

    }
}

const isCourseEnrolled = (req, res) => {
    try {
        orderModel.find({ user: req.userId, course: req.params.courseId }).then((response) => {
            if (response[0]) {
                res.status(200).json({ enrolled: true, message: "Course already  exist" });
            } else {
                res.status(200).json({ enrolled: false, message: "Course not  exist" });
            }
        })
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });

    }
}

const search = (req, res) => {
    try {
        key = req.query.q.replace(/[^a-zA-Z ]/g, "")
        courseModel.find({ name: { $regex: key, $options: 'i' } }).then((response) => {
            res.status(200).json({ status: true, result: response });
        })
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getCourseDetailsForTeacher = (req, res) => {
    try {
        courseModel.findById({ _id: req.params.courseId, teacher: res.teacherId }).then((response) => {
            res.status(200).json({ status: true, courseDetails: response });
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const EditCourseDetails = async (req, res) => {
    try {
        console.log(req.body);
        let image = {};
        let course = await courseModel.findOne({ _id: req.body.courseId, teacher: res.teacherId });
        if (req.files.image) {
            req.files.image[0].path = req.files.image[0].path.replace('public\\', "");
            image = req.files.image[0]
        } else {
            image = course.image;
        }
        if (course) {
            courseModel.updateOne({ _id: req.body.courseId, teacher: res.teacherId }, {
                $set: {
                    name: req.body.name,
                    about: req.body.about,
                    category: req.body.category,
                    duration: req.body.duration,
                    language: req.body.language,
                    price: req.body.price,
                    description: req.body.description,
                    course: req.body.course,
                    image
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "Course updated successfully" });

            })
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}


const getCourseFullDetails=async(req,res)=>{
    try {
        courseModel.findOne({ _id: req.params.courseId }).populate('teacher').lean().then((response) => {
            res.status(200).json({ status: true, courseDetails: response });
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });

    }
}

module.exports = { addCourse, getCourse, deleteCourse, getTopCourse, getCourseDetails, getAllCourses, getEnrolledCourse, isCourseEnrolled, search, getCourseDetailsForTeacher, EditCourseDetails, getCourseFullDetails }