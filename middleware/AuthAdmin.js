const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const secret_key = process.env.SECRET_KEY;

const verifyAdminLogin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secret_key, async (err, decoded) => {
            // console.log(decoded.iat);

            if (err) {
                res.json({ status: false, message:"Permission not allowed" });
            } else {
                const admin = adminModel.findById({ _id: decoded.id });
                if (admin) {
                    res.json({ status: true });
                    next()
                } else {
                    res.json({ status: false, message: "Admin not exists" })
                }
            }
        });
    } else {
        res.json({ status: false, message: 'Token not provided' })
        next()
    }
}

module.exports = { verifyAdminLogin }