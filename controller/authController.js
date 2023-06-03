const userModel = require('../models/userModel');
const { sendVerificationCode, verifyOtp } = require('../helpers/otp_verification');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const secret_key = process.env.SECRET_KEY;
const axios = require('axios');
const User = require('../models/userModel');



let userDetais;

//generate jwt token
const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}

//generating otp for user login
const generateOtp = async (req, res, next) => {
    try {
        // throwing error if values are not provided
        if (!req.body.email) throw Error("Email is required");
        //Checking email is already exist 
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            //sending otp to registered email
            sendVerificationCode(req.body.email, req)
                .then((response) => {
                    res.json({ status: true, message: "OTP successfully send" });
                    userDetais = req.body;
                }).catch((response) => {
                    res.json({ status: false, message: "OTP not send" });
                })
        } else {
            res.json({ status: false, message: "Email already exists " })
        }
    } catch (error) {
        next(error);
    }
}


//user signup using email
const doSignup = async (req, res, next) => {
    try {
        verifyOtp(req.body.otp)
            .then(async (response) => {
                const { firstName, email, password } = userDetais;
                // throwing error if values are not provided
                if (!firstName || !email || !password) throw Error("All Fields required");
                //seting default picture
                const picture = process.env.BASE_URL + "/images/user-avatar.png"
                //creating new user 
                const user = await userModel.create({ firstName, email, password, picture });
                res.status(201).json({ status: true, message: "OTP verified successfully" })
            })
            .catch((response) => {
                res.json({ status: false, message: "OTP not match" })
            })
    } catch (error) {
        next(error);
    }
}


//user login using email
const doLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // throwing error if values are not provided
        if (!email || !password) throw Error("All Fields required");
        // finding the user
        const user = await userModel.findOne({ email: email });
        if (user) {
            //checking user status
            if (user.status) {
                //checking user password
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    //creating twt token using user id
                    const token = createTocken(user._id);
                    res.status(200).json({ user, token, login: true });
                } else {
                    res.json({ login: false, message: "Incorrect username or password" });
                }
            } else {
                res.json({ status: "Blocked", message: "Account suspended" })
            }
        } else {
            res.json({ message: "Email not exists", login: false })
        }
    } catch (error) {
        next(error)
    }
}


//user login using google Auth
const googleAuth = (req, res) => {
    try {

        if (req.body.access_token) {
            //fetching user details form google
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.body.access_token}`).then(async (response) => {
                //checking user exist or not
                const user = await User.findOne({ email: response.data.email }, { password: 0 })

                    if (user) {
                        //checking user is login with google or not
                        if (user.loginWithGoogle) {
                            //checking status
                            if (user.status) {
                                //login success
                                const token = createTocken(user._id);
                                res.status(200).json({ created: true, user, token, message: "Login Success" })
                            } else {
                                //if status false account suspended
                                res.json({ status: "Blocked", message: "Account suspended" });
                            }
                        }else{
                            res.status(404).json({ created: false, message: "Email already exists" });
                        }
                        
                    } else {
                        //if user not exist creating new account
                        const newUser = await User.create({
                            googleId: response.data.id,
                            firstName: response.data.given_name,
                            lastName: response.data.family_name,
                            email: response.data.email,
                            loginWithGoogle: true,
                            picture: response.data.picture,
                            password: response.data.id
                        });
                        //creating jwt token 
                        const token = createTocken(newUser._id);
                        res.status(200).json({ created: true, user: newUser, token, message: "Signup Success" })
                    }

               
            })
        } else {
            res.status(401).json({ message: "Not authorized" });
        }
    } catch (error) {
        next(error);
    }
}


//function to check user is loged in or not by verifying the user details
const userAuthentication = (req, res) => {
    try {
        //accessing the token
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            //verifying user token
            jwt.verify(token, secret_key, async (err, decoded) => {
                if (err) {
                    res.json({ status: false, message: "Unauthorized" });
                } else {
                    //fetching user details
                    const user = await userModel.findOne({ _id: decoded.id, status: true });
                    if (user) {
                        res.status(200).json({ status: true, user, message: "Authorized" });
                    } else {
                        res.json({ status: false, message: "User not exists" })
                    }
                }
            });
        } else {
            res.json({ status: false, message: 'Token not provided' })
        }
    } catch (error) {
        next(error);
    }
}


module.exports = { generateOtp, doSignup, doLogin, googleAuth, userAuthentication }