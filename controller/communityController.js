const Community = require('../models/communityModel');


const handleError = (err) => {
    if (err.code === 11000) {
        return "Community Name is already exists";
         
    }

    // if (err.message.includes("Users validation failed")) {
    //     Object.values(err.errors).forEach((properties) => {
    //         errors[properties.path] = properties.message
    //     })
    //     return errors
    // }
}

module.exports.createCommunity = async (req, res) => {
    try {
        const newCommunity = new Community({
            name: req.body.name,
            type: req.body.type,
            about: req.body.about,
            admin: req.userId,
            image:req.files.image[0]
        })
        newCommunity.members.push(req.userId);
        let community=await newCommunity.save()
        if(community){
            res.status(200).json({ status: true, message:"Community Created Successfully"})
        }else{
            res.json({ status: false, message: "Community Not Created " })
        }
    } catch (err) {
        let error =handleError(err)
        res.json({ status: false, message: error })
    }
}
