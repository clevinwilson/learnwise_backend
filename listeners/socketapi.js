const io = require("socket.io")();

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
    socket.on('sendMessage',({userId,groupId,text})=>{
        console.log(`Message received in group ${userId}: ${text}`);
        io.to(groupId).emit('receiveMessage', { userId, text });
    })

    // Clean up when the client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
})

module.exports = socketapi;