const userModel = require('../models/userModel');
const {sendVerificationCode} =require('../helpers/otp_verification');
const { response } = require('express');


const generateOtp=(req,res,next)=>{
    try{
        sendVerificationCode(req.body.email, req)
        .then((response) => {
            res.json({ status: true, message: "OTP successfully send" })
        }).catch((response) => {
            res.json({ status: false, message: "OTP not send" })
        })
    }catch(err){
        console.log(err);
        res.json({serverError:true,message:"Internal server error"})
    }
}

const doSignup=async (req,res,next)=>{
    let { firstName, email, password } = req.body;
    console.log(req.body);
    const user =await userModel.create({firstName,email,password});

}

module.exports = {generateOtp,doSignup}