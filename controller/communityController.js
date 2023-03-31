const Community = require('../models/communityModel');
const User = require('../models/userModel');


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
        req.files.image[0].path = req.files.image[0].path.replace('public\\', "");
        const newCommunity = new Community({
            name: req.body.name,
            type: req.body.type,
            about: req.body.about,
            admin: req.userId,
            image: req.files.image[0]
        })
        newCommunity.members.push(req.userId);
        let community = await newCommunity.save()
        if (community) {
            res.status(200).json({ status: true, message: "Community Created Successfully" })
        } else {
            res.json({ status: false, message: "Community Not Created " })
        }
    } catch (err) {
        let error = handleError(err)
        res.json({ status: false, message: error })
    }
}

module.exports.getAllCommunity = async (req, res) => {
    try {
        let community = await Community.find();
        if (community) {
            res.status(200).json({ status: true, community: community });
        } else {
            res.status(404).json({ status: false, message: "Something went wrong" })
        }
    } catch (err) {
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}


module.exports.joinCommunity = async (req, res) => {
    try {
        if (req.body.userId) {
            //checking community exists or not
            let community=await Community.find({_id:req.body.communityId});
            if(community){
                //updating community array
                let join = await Community.updateOne({ _id: req.body.communityId }, {
                    $addToSet: {
                        members: req.body.userId
                    }
                })
                //updating user array 
                let user = await User.updateOne({ _id: req.body.userId }, {
                    $addToSet: {
                        community: req.body.communityId
                    }
                })

                if (join && user.acknowledged) {
                    res.status(200).json({ status: true, message: "Joined successfully" })
                } else {
                    res.json({ status: false, message: "Something went wrong try again" })
                }
            }else{
                res.status(404).json({ status: false, message: "Community not Exist" })
            }
        } else {
            res.status(404).json({ status: false, message: "User ID is not provided" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

module.exports.getJoinedCommunit=async(req,res)=>{
    try{
        console.log(req.userId);
        if(req.userId){
            let joinedCommunityList = await User.find().populate('community');
            
            res.status(200).json({status:true,joinedCommunity:joinedCommunityList[0].community})
        }else{
            throw new Error("User Id not provided")
        }
    }catch(err){
        res.json({ status: false, message: err.message });
    }
}
