const userModel = require('../models/userModel');
const { sendVerificationCode, verifyOtp } = require('../helpers/otp_verification');

let userDetais;


const generateOtp = async (req, res, next) => {
    try {
       let user=await userModel.findOne({email:req.body.email});
        if(!user){

            sendVerificationCode(req.body.email, req)
            .then((response) => {
                res.json({ status: true, message: "OTP successfully send" })
                userDetais = req.body;
            }).catch((response) => {
                res.json({ status: false, message: "OTP not send" })
                
            })
        }else{
            res.json({ status: false, message:"Email already exists "})
        }
    } catch (err) {
        res.status(500).json({ serverError: true, message: "Internal server error" })
    }
}

const doSignup = async (req, res, next) => {
    try {
        verifyOtp(req.body.otp)
            .then(async(response) => {
                const{firstName,email,password}=userDetais;
                const user = await userModel.create({ firstName, email,password });
                res.status(200).json({ status: true, message: "OTP verified successfully" })
            })
            .catch((response) => {
                res.json({ status: false, message: "OTP not match" })
            })
    } catch (err) {
        res.status(500).json({ serverError: true, message: "Internal server error" })

    }
}

module.exports = { generateOtp, doSignup }