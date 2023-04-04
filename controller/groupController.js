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
            description: req.body.description
        })
        let group = await newGroup.save()

        if (group) {
            console.log(req.userId);
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

module.exports.getCommunityGroups=async(req,res)=>{
    try{
       if(req.params.communityId){
           let community = await Community.findOne({ _id: req.params.communityId }, { project: 1, groups: 1 }).populate('groups')
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
}