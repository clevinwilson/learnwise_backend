const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    description: {
        type: String,
    },
    members:{
        type:[],
    },
    groups: {
        type: [],
    },
    posts:{
        type: [],
    },
    image:{
        type:Object,
        required:true
    }
})


module.exports = mongoose.model("Communitys", CommunitySchema);