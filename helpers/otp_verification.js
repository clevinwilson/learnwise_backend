const nodemailer = require('nodemailer');
const auth_email = process.env.AUTH_EMAIL;
const auth_password = process.env.AUTH_EMAIL_PASSWORD;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: auth_email,
        pass: auth_password
    }
});


function sendVerificationCode(email,req){
    return new Promise((resolve,reject)=>{
        const otp = Math.floor(1000 + Math.random() * 9000);
        req.session.otp=otp
        let mailOptions = {
            from: auth_email,
            to: '' + email,
            subject: 'OTP to verify',
            html: `<p>Your OTP code is <span style=font-size:20px><b>${otp}</b></span>. Please enter this code to verify your email address.</p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
               reject()
            } else {
                resolve({ status: true })
            }
        });
    })

}


module.exports={sendVerificationCode}