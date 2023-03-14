const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "User name is required"],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email name is required"],
        unique: true
    },
    phone: {
        type: Number,

    },
    googleId:{
        type:String,
        allowNull:true
    },
    loginWithGoogle: {
        type: Boolean,
        default: false,
    },
    picture:{
        type:String
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    image: {
        type: Object,
    }
})

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);

})

module.exports = mongoose.model("Users", userSchema);