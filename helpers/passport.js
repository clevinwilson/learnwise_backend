const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const User = require('../models/userModel');



passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
    async function (accessToken, refreshToken, profile, cb) {
        const user = await User.findOne({ email: profile.emails[0].value,loginWithGoogle:true});
        if(user){
            return cb(null,user);
        }else{
            const newUser=await User.create({
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                email:profile.emails[0].value,
                loginWithGoogle:true,
                picture:profile.photos[0].value,
                password:profile.id
            });

            return cb(null,newUser);
        }
    }
));


passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    console.log(obj);
    cb(null, obj);
});