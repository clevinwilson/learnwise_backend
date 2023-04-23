const userModel = require('../models/userModel');
const { sendVerificationCode, verifyOtp } = require('../helpers/otp_verification');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const secret_key = process.env.SECRET_KEY;
const axios = require('axios');
const User = require('../models/userModel');



let userDetais;

const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}


const generateOtp = async (req, res, next) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) {

            sendVerificationCode(req.body.email, req)
                .then((response) => {
                    res.json({ status: true, message: "OTP successfully send" })
                    userDetais = req.body;
                }).catch((response) => {
                    res.json({ status: false, message: "OTP not send" })

                })
        } else {
            res.json({ status: false, message: "Email already exists " })
        }
    } catch (err) {
        res.status(500).json({ serverError: true, message: "Internal server error" })
    }
}

const doSignup = async (req, res, next) => {
    try {
        verifyOtp(req.body.otp)
            .then(async (response) => {
                const { firstName, email, password } = userDetais;
                const user = await userModel.create({ firstName, email, password });
                res.status(201).json({ status: true, message: "OTP verified successfully" })
            })
            .catch((response) => {
                res.json({ status: false, message: "OTP not match" })
            })
    } catch (err) {
        res.status(500).json({ serverError: true, message: "Internal server error" })

    }
}

const doLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            if (user.status) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
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
    } catch (err) {
        console.log(err);
        res.json({ message: err, login: false })
    }
}

const googleAuth = (req, res) => {
    try {
        if (req.body.access_token) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.body.access_token}`).then(async (response) => {

                const user = await User.findOne({ googleId: response.data.id, loginWithGoogle: true }, { password: 0 }).catch((err) => {
                    console.log("Error Signup");
                    res.status(500).json({ created: false, message: "Internal server error" })
                });


                if (user) {
                    if (user.status) {
                        const token = createTocken(user._id);
                        res.status(200).json({ created: true, user, token, message: "Login Success" })
                    } else {
                        res.json({ status: "Blocked", message: "Account suspended" })
                    }
                } else {
                    const newUser = await User.create({
                        googleId: response.data.id,
                        firstName: response.data.given_name,
                        lastName: response.data.family_name,
                        email: response.data.email,
                        loginWithGoogle: true,
                        picture: response.data.picture,
                        password: response.data.id
                    });
                    const token = createTocken(newUser._id);
                    res.status(200).json({ created: true, user: newUser, token, message: "Signup Success" })
                }
            })
        } else {
            res.status(401).json({ message: "Not authorized" });
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Error" });
    }
}


const userAuthentication = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, secret_key, async (err, decoded) => {
                if (err) {
                    res.json({ status: false, message: "Unauthorized" });
                } else {
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
    } catch (err) {
        res.status(401).json({ message: "Not authorized" });

    }
}





module.exports = { generateOtp, doSignup, doLogin, googleAuth, userAuthentication }