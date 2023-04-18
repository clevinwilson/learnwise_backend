const User = require("../models/userModel");

module.exports.getUserDetails=async(req,res)=>{
    try{
        const userDetails=await User.findById({_id:req.userId},{password:0});
        res.status(200).json({userDetails})
    }catch(error){
        res.status(404).json({ status: false, message: err.message });
    }
}

module.exports.updateUserProfile=async(req,res)=>{
    try{
        const updateUser=await User.updateOne({_id:req.userId},{
            $set:{
                firstName:req.body.firstName,
                lastName:req.body.lastName
            }
        })
        res.status(200).json({ status: true, message:"Profile updated successfully"})
    }catch (error) {
        res.status(404).json({ status: false, message: err.message });
    }
};

module.exports.updateUserAvatar=async(req,res)=>{
    try{
        const image = process.env.BASE_URL+ req.files.image[0].path.replace('public\\', "/");
        const updateUser = await User.updateOne({ _id: req.userId }, {
            $set: {
                picture: image
            }
        })
        res.status(200).json({ status: true, message: "Profile updated successfully" })
    } catch (error) {
        res.status(404).json({ status: false, message: error.message });
    }
}