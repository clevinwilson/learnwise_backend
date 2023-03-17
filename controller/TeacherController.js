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
    try{
        const { email, password } = req.body;
        const teacher = await teacherModel.findOne({ email: email });
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
    }catch(err){
        res.status(500).json({ serverError: true, message: "Internal server error" })
    }
}




const teacherAuth=(req,res)=>{
    try{
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            console.log(token,">>>>>>>>>>");
            jwt.verify(token, secret_key, async (err, decoded) => {
                // console.log(decoded.iat);

                if (err) {
                    res.json({ status: false, message: "Permission not allowed" });
                } else {
                    const teacher = teacherModel.findById({ _id: decoded.id });
                    if (teacher) {
                        res.json({ status: true, message: "Authorized" })
                    } else {
                        res.json({ status: false, message: "Admin not exists" });
                    }
                }
            });
        } else {
            res.json({ status: false, message: 'Token not provided' });
        }
    }catch(err){
        res.status(500).json({ serverError: true, message: "Internal server error" })
    }
}






module.exports = { doLogin, teacherAuth }