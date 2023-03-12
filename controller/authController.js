const userModel = require('../models/userModel');
const { sendVerificationCode, verifyOtp } = require('../helpers/otp_verification');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const secret_key = process.env.SECRET_KEY;


let userDetais;

const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}


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

const doLogin=async(req,res,next)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            const token = createTocken(user._id);
            res.cookie("jwt", token, {
                withCredential: true,
                httpOnly: false,
                maxAge: maxAge * 1000
            })
            user.password="empty"
            res.status(200).json({ user, token, login: true });
        } else {
            res.json({ login: false, message:"Incorrect username or password"});
        }
    } else {

        res.json({ message: "Email not exists", login: false })
    }
}

module.exports = { generateOtp, doSignup, doLogin }