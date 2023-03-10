const nodemailer = require('nodemailer');
const auth_email = process.env.AUTH_EMAIL;
const auth_password = process.env.AUTH_EMAIL_PASSWORD;

let otpValue=null

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: auth_email,
        pass: auth_password
    }
});


function sendVerificationCode(email){
    return new Promise((resolve,reject)=>{
        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
            from: auth_email,
            to: '' + email,
            subject: 'OTP to verify',
            html: `<p>Your OTP code is <span style=font-size:20px><b>${otp}</b></span>. Please enter this code to verify your email address.</p>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
               reject()
            } else {
                otpValue=otp
                resolve({ status: true,otp })
            }
        });
    })

}

function verifyOtp(otp,){
    return new Promise((resolve,reject)=>{
        if (otpValue==otp){
            resolve({status:true});
        }else{
            reject();
        }
    })
}


module.exports = { sendVerificationCode, verifyOtp }