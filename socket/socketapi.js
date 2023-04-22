const io = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
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
        console.log('send Message');
        let sender = await User.find({ _id: userId }, { firstName: 1, picture:1});
        io.to(groupId).emit('receiveMessage', { sender: sender[0], groupId, text });
    })


    //send image
    socket.on("sendImage", async (data) => {
        console.log("sendImage");
        let sender = await User.find({ _id: data.sender }, { firstName: 1, picture:1 });
        
        io.to(data.group).emit('receiveMessage', { sender: sender[0], groupId: data.group,type:data.type,image:data.image, text: data.text });
    });

    // Clean up when the client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

})

module.exports = socketapi;