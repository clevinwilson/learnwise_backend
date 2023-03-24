const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    about:{
        type: String,
        required: true,
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required:true,
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    course: [
        {
            chapter:String,
            image:String,
            lessons:[
                {
                    chapterName:String,
                    lessonName:String,
                    videoUrl:String 
                }
            ]
        }
    ],
    image:{
        type: Object,
        required: true
    }
})


module.exports = mongoose.model("Courses", CourseSchema);