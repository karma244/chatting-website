const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { addUser, removeUser } = require('./user');
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://14.38.139.193:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  socket.on('join server', (item, callback) => {
    const { error, user } = addUser({ id:socket.id, name: item.name })
    if (error) callback({ error: 'ERROR' })
    var clientIPAddress = socket.request.connection.remoteAddress; 
    console.log(`${user.name}님의 IP : ${clientIPAddress}`)
    setTimeout(() => {io.emit('receive message', {
      name:'NOTIFICATION', 
      message:`${user.name}님이 들어왔습니다.`, 
      time: `${new Date().getHours()} : ${new Date().getMinutes()}`})}, 100)
  })
  socket.on('send message', (item) => {
    const msg = `${item.name} : ${item.message} (${item.time})`;
    console.log(msg);
    io.emit('receive message', {name:item.name, message:item.message, time: item.time});
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if (user) {
      io.emit('receive message', {
        name:'NOTIFICATION', 
        message:`${user.name}님이 나갔습니다.`, 
        time: `${new Date().getHours()} : ${new Date().getMinutes()}`})
    }
  })
});

server.listen(port, () => console.log(`Listening on port ${port}`));