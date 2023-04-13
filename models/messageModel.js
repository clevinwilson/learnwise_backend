const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Groups"
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
)


module.exports = mongoose.model("Messages", MessageSchema);