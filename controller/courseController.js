const { response } = require('express');
const { default: mongoose } = require('mongoose');
const courseModel = require('../models/courseModel');
const Course = require('../models/courseModel');
const { findById } = require('../models/userModel');

const addCourse = async (req, res) => {
    try {
        req.files.image[0].path = req.files.image[0].path.replace('public\\', "");

        const newCourse = new Course({
            name: req.body.name,
            teacherId: res.teacherId,
            category: req.body.category,
            duration: req.body.duration,
            language: req.body.language,
            price: Number(req.body.price),
            description: req.body.description,
            image: req.files.image[0],
            course: req.body.course
        })

        return await newCourse.save()
            .then(() => {
                res.status(200).json({ status: true, message: "Course added Successfully" })
            }).catch((error) => {
                res.status(500).json({ status: true, message: "Internal server error" })
            })

    } catch (err) {
        res.status(500).json({ status: true, message: "Internal server error" });
    }
}


const getCourse = async (req, res) => {
    try {
        let course = await courseModel.find({ teacherId: res.teacherId });
        if (course) {
            res.status(200).json({ status: true, course })
        }
    } catch (err) {
        res.status(500).json({ status: true, message: "Internal server error" });
    }

}

const deleteCourse = async (req, res) => {
    try {
        courseModel.findOneAndDelete({ _id: req.params.courseId })
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

        let course = await courseModel.find().populate('teacher').lean();

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
        courseModel.findById({ _id: req.params.courseId }).populate('teacher').lean().then((response) => {

            res.status(200).json({ status: true, courseDetails: response });

        }).catch((err) => {
            throw new Error('Internal server error');
        })
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

module.exports = { addCourse, getCourse, deleteCourse, getTopCourse, getCourseDetails }