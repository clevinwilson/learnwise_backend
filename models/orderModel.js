const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    total:{
        type:Number,
        required:true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required: true,
    },
    address: {
        type:{},
        required: true,
    },
    purchase_date: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    }
})



module.exports = mongoose.model("Orders", OrderSchema);