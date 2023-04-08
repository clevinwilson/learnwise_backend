const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: Object,
        required: true
    },
    members:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',  
    },
    description: {
        type: String,
        required:true
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model("Groups", GroupSchema);