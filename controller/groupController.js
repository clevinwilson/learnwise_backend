const { response } = require('../app');
const Community = require('../models/communityModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');


const handleError = (err) => {
    if (err.code === 11000) {
        return "Group Name is already exists";

    }

}


module.exports.createGroup = async (req, res) => {
    req.files.image[0].path = req.files.image[0].path.replace('public\\', "");
    try {
        let newGroup = new Group({
            name: req.body.name,
            image: req.files.image[0],
            description: req.body.description,
            members:[req.userId],
            community: req.body.communityId,
            admin:req.userId
        })
        let group = await newGroup.save()

        if (group) {
            //updating in user database
            let user = await User.updateOne({ _id: req.userId }, {
                $addToSet: {
                    group: group._id
                }
            })

            if (user) {
                //update group id in community page
                Community.updateOne({ _id: req.body.communityId }, {
                    $addToSet: {
                        groups: group._id
                    }
                }).then((response) => {
                    res.status(200).json({ status: true, message: "Group Created Successfully" })
                })
            }
        }
    } catch (err) {
        let error = handleError(err)
        res.status(404).json({ status: false, message: error });
    }
}


//get all groups under a community 
module.exports.getCommunityGroups=async(req,res)=>{
    try{
       if(req.params.communityId){
           let community = await Community.findOne({ _id: req.params.communityId, status: true }, { project: 1, groups: 1 }).populate('groups')
           if (community) {
               res.status(200).json({ status: true, community })
           } else {
               throw new Error("Community not exist")
           }
       }else{
        throw new Error("Community Id not provided")
       }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
};


//join a community
module.exports.joinGroup=async(req,res)=>{
    try{
        //checking user joinde the community
        let checkUserJoined = await Community.findOne({ _id: req.params.communityId, members: { $in: [req.userId] } });
        if (checkUserJoined) {
            //adding the user to group
           let group=await Group.updateOne({ _id: req.params.groupId }, {
                $addToSet: { members: req.userId }
            })

            //updating in user collection
            let user = await User.updateOne({ _id: req.userId }, {
                $addToSet: { group: req.params.groupId}
            })
            
            if(group && user){
                res.status(200).json({ status: true, message: "Joined Successfully" })
            }else{
                throw new Error("Something went wrong")
            }
        }else{
            throw new Error("Join the Community")
        }
    }catch(err){
        res.status(404).json({ status: false, message: err.message });
    }
}

//list all groups that user joined
module.exports.getJoinedGroups=async(req,res)=>{
    try{
        if(req.userId){
            let user = await User.find({ _id: req.userId }).populate('group');
            res.status(200).json({status:true,groups:user[0].group})
        }else{
            throw new Error("User Id is not Provided")
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

//list all groups in all community
module.exports.getAllGroups = async (req, res) => {
    try {
        const group = await Group.find();
        if (group) {
            res.status(200).json({ status: true, group })
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}