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
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Communitys',  
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model("Groups", GroupSchema);