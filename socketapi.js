const io = require("socket.io")();

const socketapi = {
    io: io
};

io.on('connection',(port)=>{
    console.log("A user Connected");
})

module.exports = socketapi;