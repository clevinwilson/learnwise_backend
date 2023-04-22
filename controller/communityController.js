const { response } = require('../app');
const Community = require('../models/communityModel');
const Group = require('../models/groupModel');
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
        req.files.image[0].path = req.files.image[0].path.replace('public/', "");
        const newCommunity = new Community({
            name: req.body.name,
            type: req.body.type,
            about: req.body.about,
            admin: req.userId,
            image: req.files.image[0],
            description: req.body.description
        })
        newCommunity.members.push(req.userId);
        let community = await newCommunity.save()

        // //updating user array
        let user = await User.updateOne({ _id: req.userId }, {
            $addToSet: {
                community: community._id
            }
        })

        if (community && user) {
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
        let community = await Community.find({ status: true }, { posts: 0, groups: 0 });
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
            let community = await Community.find({ _id: req.body.communityId });
            if (community) {
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
            } else {
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

module.exports.getJoinedCommunit = async (req, res) => {
    try {
        if (req.userId) {
            let joinedCommunityList = await User.find({ _id: req.userId }, { posts: 0, groups: 0 }).populate('community');

            res.status(200).json({ status: true, joinedCommunity: joinedCommunityList[0].community })
        } else {
            throw new Error("User Id not provided")
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
}

//get community detalils feeds(posts) not included
module.exports.getCommunityDetails = async (req, res) => {
    try {
        let admin = false;
        let communityDetails = await Community.findById({ _id: req.params.communityId, status: true }, { posts: 0 }).populate('groups')
        if (communityDetails) {
            //checking user is admin or not
            if (req.userId.equals(communityDetails.admin)) admin = true;

            res.status(200).json({ status: true, communityDetails, admin })
        } else {
            throw new Error("Community not Exist")
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
}

//create community post
module.exports.createCommunityPost = async (req, res) => {
    try {

        let post = {
            user: req.userId,
            message: req.body.message,
        }
        if (req.files.image) {
            post.image = req.files.image[0]
            req.files.image[0].path = req.files.image[0].path.replace('public/', "");

        }

        //checking user is the admin of community
        let community = await Community.findById({ _id: req.body.communityId, admin: req.userId })
        if (community) {
            let createPost = await Community.updateOne({ _id: req.body.communityId }, {
                $push: {
                    posts: post
                }
            })
            if (createPost) {
                res.status(200).json({ status: true, message: "Post Created Successfully" })
            } else {
                throw new Error("Something went wrong")
            }
        } else {
            throw new Error("Not permitted")
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
}


module.exports.getCommunityFeeds = async (req, res) => {
    try {
        if (req.params.communityId) {
            let community = await Community.findOne({ _id: req.params.communityId }, { _id: 1, name: 1, posts: 1 }).populate({
                path: 'posts',
                populate: { path: 'user', select: 'firstName picture' }
            });
            community.posts=community.posts.reverse();

            if (community) {
                res.status(200).json({ status: true, community: community })
            } else {
                throw new Error("Community not exist")
            }
        } else {
            throw new Error("CommunityId is not provided")
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
}

//get commuity members
module.exports.getCommunityMembers = async (req, res) => {
    try {
        if (req.params.communityId) {
            let members = await Community.findOne({ _id: req.params.communityId }, { _id: 1, admin: 1, members: 1 }).populate("admin", '-password').populate("members", '-password');
            console.log(members);
            if (members) {
                res.status(200).json({ status: true, community: members })
            } else {
                throw new Error("Community not exist")
            }
        } else {
            throw new Error("CommunityId is not provided")
        }
    } catch (err) {
        res.json({ status: false, message: err.message });
    }
}



module.exports.editCommunity = async (req, res) => {
    try {
        let image = {};
        let community = await Community.findOne({ _id: req.body.communityId });
        if (community) {
            //seting image
            if (req.files.image) {
                image = req.files.image[0];
                req.files.image[0].path = req.files.image[0].path.replace('public/', "");

            } else {
                image = community.image;
            }

            Community.updateOne({ _id: req.body.communityId }, {
                $set: {
                    name: req.body.name,
                    type: req.body.type,
                    about: req.body.about,
                    description: req.body.description,
                    image
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "Updated Successfully" })
            })
                .catch((err) => {
                    throw new Error("Community Details not Updated ")
                })
        } else {

            throw new Error("Community Not exist")
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}


module.exports.leaveFromCommunity = async (req, res) => {
    try {
        let community = await Community.findOne({ _id: req.params.communityId });
        if (community) {

            community.groups.forEach(async (obj) => {
                //removing group id form user 
                let user = await User.updateOne({ _id: req.userId }, {
                    $pull: {
                        group: obj
                    }
                })

                //removing userid form groups
                await Group.updateOne({ _id: obj }, {
                    $pull: {
                        members: req.userId
                    }
                })
            })

            //removing user form community
            let updateCommunity = await Community.updateOne({ _id: req.params.communityId }, {
                $pull: {
                    members: req.userId
                }
            })

            //removing community form user collection
            let updateUser = await User.updateOne({ _id: req.userId }, {
                $pull: {
                    community: req.params.communityId
                }
            })

            if (updateCommunity && updateUser) {
                res.status(200).json({ status: true })
            } else {
                throw new Error("Something went wrong")
            }

        } else {
            throw new Error("Community Not exist")
        }
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}


//delete community
module.exports.deleteCommunity=async(req,res)=>{
    try{
        let community = await Community.findOne({admin:req.userId, _id: req.params.communityId });
        if(community){
            //deleting all groups under this community
            community.groups.forEach(async(groupId)=>{
               await Group.deleteOne({_id:groupId})
            })

            //deleting community
            Community.deleteOne({ admin: req.userId, _id: req.params.communityId }).then((response) => {
                res.status(200).json({ status: true, message:"Community deleted Successfully"})
            })

        }
    }catch(err){
        res.status(404).json({ status: false, message: err.message });
    }
}