const Message = require('../models/messageModel');

module.exports.createMessage=async(req,res)=>{
    try{
        console.log(req.body);
        const {user,text,group}=req.body;
        const newMessage=new Message({
            group,
            sender:user,
            text
        })
        const savedMessage =await newMessage.save();
        res.status(200).json(savedMessage);

    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}

module.exports.getMessages=async(req,res)=>{
    try{
        const messages = await Message.find({
            group: req.params.groupId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}