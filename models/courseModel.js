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
    teacherRevenue:{
        type:Number,
        required:true
    },
    adminRevenue:{
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
    },
    status:{
        type:Boolean,
        default:true,
        required:true,
    },
    createdAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model("Courses", CourseSchema);