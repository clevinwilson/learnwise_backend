const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const secret_key = process.env.SECRET_KEY;

const verifyLogin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, secret_key, async (err, decoded) => {
                // console.log(decoded.iat);
                console.log(decoded);

                if (err) {
                    res.json({ status: false, message: "Unauthorized" });
                } else {
                    const user = await userModel.findOne({ _id: decoded.id });
                    if (user) {
                        req.userId=user._id;
                        next();
                    } else {
                        res.status(404).json({ status: false, message: "User not exists" })
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

module.exports = { verifyLogin }