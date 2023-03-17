const Course = require('../models/courseModel');

const addCourse = async (req, res) => {
    try {

        const newCourse = new Course({
            name: req.body.name,
            category: req.body.category,
            duration: req.body.duration,
            language: req.body.language,
            price:Number(req.body.price),
            description: req.body.description,
            image: req.files.image[0],
            course: req.body.course
        })

        return await newCourse.save()
            .then(() => {
                res.status(200).json({ status: true, message:"Course added Successfully"})
            }).catch((error) => {
                res.status(500).json({ status: true, message: "Internal server error" })
            })

    } catch (err) {
        res.status(500).json({ status: true, message: "Internal server error" })
    }
}


module.exports = { addCourse }