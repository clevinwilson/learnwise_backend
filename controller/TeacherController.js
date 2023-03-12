const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const teacherModel = require('../models/teacherModel');
const secret_key = process.env.SECRET_KEY;


const createTocken = (id) => {
    return jwt.sign({ id }, secret_key, {
        expiresIn: maxAge
    });
}


const doLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const admin = await teacherModel.findOne({ email: email });
    if (admin) {
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
            const token = createTocken(admin._id);
            res.cookie("jwt", token, {
                withCredential: true,
                httpOnly: false,
                maxAge: maxAge * 1000
            })
            admin.password = "empty"
            res.status(200).json({ admin, token, created: true });
        } else {
            res.json({ created: false, message: "Incorrect username or password" });
        }

    } else {
        const errors = { name: "Email not exists" }
        res.json({ errors, created: false })
    }
}


module.exports={doLogin}