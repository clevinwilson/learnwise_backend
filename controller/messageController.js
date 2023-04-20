const Message = require('../models/messageModel');

module.exports.createMessage = async (req, res) => {
    try {
        const { text, group } = req.body;
        const newMessage = new Message({
            group,
            sender: req.userId,
            type: "text",
            text
        })
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);

    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ group: req.params.groupId }).populate('sender');
        res.status(200).json(messages);
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}


module.exports.sendImage = async (req, res) => {
    try {
        req.files.image[0].path = req.files.image[0].path.replace('public\\', "");
        if (req.files) {
            const newMessage = new Message({
                group: req.body.group,
                sender: req.userId,
                type: "file",
                text: req.body.text,
                image: process.env.BASE_URL + "/" + req.files.image[0].path
            })
            const savedMessage = await newMessage.save();
            res.status(200).json({ group: savedMessage.group, sender: { _id: savedMessage.sender },text:savedMessage.text, type: savedMessage.type, image: savedMessage.image });
        } else {
            throw new Error("Image is not provided")
        }

    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}