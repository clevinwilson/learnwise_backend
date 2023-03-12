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
    const teacher= await teacherModel.findOne({ email: email });
    if (teacher) {
        const validPassword = await bcrypt.compare(password, teacher.password);
        if (validPassword) {
            const token = createTocken(teacher._id);
            teacher.password = "empty"
            res.status(200).json({ teacher, token, login: true });
        } else {
            res.json({ login: false, message: "Incorrect username or password" });
        }
    } else {
        res.json({ message: "Email not exists", login: false })
    }
}


module.exports={doLogin}