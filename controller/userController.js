const User = require("../models/userModel");


//fetching user details 
module.exports.getUserDetails=async(req,res)=>{
    try{
        const userDetails=await User.findById({_id:req.userId},{password:0});
        res.status(200).json({userDetails})
    }catch(error){
        next(error);
    }
}


//updating the user profile
module.exports.updateUserProfile=async(req,res)=>{
    try{
        const { firstName, lastName } = req.body;
        // throwing error if values are not provided
        if (!firstName || !lastName) throw Error("All Fields required");
        //updating the user details
        const updateUser=await User.updateOne({_id:req.userId},{
            $set:{
                firstName,
                lastName
            }
        })
        res.status(200).json({ status: true, message:"Profile updated successfully"})
    }catch (error) {
        next(error);
    }
};


//changing the user profile photo
module.exports.updateUserAvatar=async(req,res)=>{
    try{
        //updating the image upload path
        const image = process.env.BASE_URL + req.files.image[0].path.replace('public', "/");
        //updating the data
        const updateUser = await User.updateOne({ _id: req.userId }, {
            $set: {
                picture: image
            }
        })
        res.status(200).json({ status: true, message: "Profile updated successfully" })
    } catch (error) {
        next(error);
    }
}