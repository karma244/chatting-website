const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);
let time = `${new Date().getHours()} : ${new Date().getMinutes()}`

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://59.7.54.86:3000",
    methods: ["GET", "POST"],
    transports: ['websocket']
  }
});

io.on("connection", socket => {
  socket.on('join server', (item) => {
    var clientIPAddress = socket.request.connection.remoteAddress; 
    console.log(`${item.name}님의 IP : ${clientIPAddress}`)
    setTimeout(() => {io.emit('receive message', {name:'NOTIFICATION', message:`${item.name}님이 들어왔습니다.`, time: time})}, 100)
  })
  socket.on('send message', (item) => {
    const msg = item.name + ' : ' + item.message;
    console.log(item.time)
    console.log(msg);
    io.emit('receive message', {name:item.name, message:item.message, time: item.time});
  })
});

server.listen(port, () => console.log(`Listening on port ${port}`));