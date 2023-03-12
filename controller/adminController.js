const adminModel=require('../models/adminModel')
const { sendVerificationCode, verifyOtp } = require('../helpers/otp_verification');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const secret_key = process.env.SECRET_KEY;
const teacherSchema = require('../models/teacherModel');
const { sendEmail } =require('../helpers/sendEmail')

const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}



const doLogin=async(req,res,next)=>{
    const {email,password}=req.body;
    const admin=await adminModel.findOne({email:email});
    if(admin){
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
            const token = createTocken(admin._id);
            res.cookie("jwt", token, {
                withCredential: true,
                httpOnly: false,
                maxAge: maxAge * 1000
            })
            admin.password = "empty"
            res.status(200).json({ admin, token, login: true });
        } else {
            res.json({ login: false, message: "Incorrect username or password" });
        }

    } else {
        res.json({ message: "Email not exists", login: false })
    }
}

const addTeacher=async(req,res)=>{
    const {firstName,lastName,email,phone,place}=req.body;
    const randomNum = Math.floor(Math.random() * 1000000);
    const password = randomNum.toString().padStart(6, '0');

    const teacher=await teacherSchema.findOne({email:email});
    if(!teacher){
        const newTeacher=new teacherSchema({
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            password: password,
            place:place
        })
        newTeacher.save()
        .then(async(data)=>{
            const emailSend=await sendEmail(email, password)
            if(emailSend.status){
                res.json({ created: true, message: "Teacher Details added successfully" });
            }
            else{

                res.json({ created: false, message: "Email Not Send" });
            }
            
        })
        .catch((err)=>{
            console.log(err);
            res.json({ created: false, message:"Error"});
        })
    }else{
        res.json({created:false,message:"Teacher already exists"});
    }
}


module.exports = { doLogin, addTeacher }