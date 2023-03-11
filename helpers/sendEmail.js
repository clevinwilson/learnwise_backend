const nodemailer = require('nodemailer');
const auth_email = process.env.AUTH_EMAIL;
const auth_password = process.env.AUTH_EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: auth_email,
        pass: auth_password
    }
});

const sendEmail=(email,password)=>{
    return new Promise((resolve,reject)=>{
        const mailOptions = {
            from: auth_email,
            to: '' + email,
            subject: 'OTP to verify',
            html: `<p>We are excited to have you as a teacher of Learnwise. To get started, please use your  email address and the following password to log in</p>
            <p><b>Password: ${password}</b></p>
            `
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("email error");
                reject();
            } else {
                console.log("email sent");
                resolve({ status: true })
            }
        });
    })
}

module.exports = { sendEmail };