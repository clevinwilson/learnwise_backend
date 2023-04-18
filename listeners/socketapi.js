const io = require("socket.io")();
const User =require('../models/userModel');

const socketapi = {
    io: io
};

io.on('connection',(socket)=>{
    console.log("A user Connected");

    //join goup
    socket.on('joinGroup', groupId => {
        console.log(`Client joined group ${groupId}`);
        socket.join(groupId);
    });

    //send message
    socket.on('sendMessage',async({userId,groupId,text})=>{
        let sender = await User.find({ _id: userId }, { firstName:1});
        io.to(groupId).emit('receiveMessage', { sender: sender[0], groupId, text });
    })

    // Clean up when the client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
})

module.exports = socketapi;