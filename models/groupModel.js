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
    description: {
        type: String,
        required:true
    },
})


module.exports = mongoose.model("Groups", GroupSchema);