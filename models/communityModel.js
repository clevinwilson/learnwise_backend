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
        ref: 'Users', 
        required:true
    },
    description: {
        type: String,
    },
    members:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users', 
    },
    groups: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Groups', 
    },
    posts:{
        type: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', },
                createdAt: { type: Date, default: Date.now },
                message:{type:String},
                image:{type:Object,default:{}}

            }
        ],
    },
    image:{
        type:Object,
        required:true
    }
})


module.exports = mongoose.model("Communitys", CommunitySchema);