const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const teacherSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"Teacher First name is required"],
    },
    lastName:{
        type:String,
        required: [true, "Teacher Last name is required"],
    },
    email:{
        type:String,
        required: [true, "Teacher Email is required"],
        unique: true
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
    }
})

teacherSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);

})

module.exports = mongoose.model("Teachers", teacherSchema);