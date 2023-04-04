const { response } = require('../app');
const Community = require('../models/communityModel');
const Group = require('../models/groupModel');


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

        //update group id in community page
        if (group) {
            Community.updateOne({ _id: req.body.communityId }, {
                $addToSet: {
                    groups: group._id
                }
            }).then((response) => {
                res.status(200).json({ status: true, message: "Group Created Successfully" })

            })
        }
        
    } catch (err) {
        let error = handleError(err)
        res.status(404).json({ status: false, message: error });
    }
}