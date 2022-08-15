const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { addUser, removeUser, getUserName, changeUserName } = require('./user');
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://172.30.1.91:3000",
    methods: ["GET", "POST"]
  }
});

let id, nickName;

io.on("connection", socket => {
  socket.on('join server', (item) => {
    name = item.name, id = socket.request.connection.remoteAddress.split("ffff:")[1];
    const { user } = addUser({ id:id, name: name });
    console.log(`${user.name}님의 IP : ${id}`)
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
  socket.on('changed name', (item) => {
    const name = getUserName(id);
    nickName = item.name;
    changeUserName(id, nickName);
    setTimeout(() => {io.emit('receive message', {
      name:'NOTIFICATION', 
      message:`${name}님이 ${item.name}로(으로) 이름 바꿈`,
      time: `${new Date().getHours()} : ${new Date().getMinutes()}`})}, 100)
  })
  socket.on('disconnect', () => {
    const user = removeUser(id)
    if (user) {
      io.emit('receive message', {
        name:'NOTIFICATION', 
        message:`${nickName}님이 나갔습니다.`,
        time: `${new Date().getHours()} : ${new Date().getMinutes()}`})
    }
  })
});

server.listen(port, () => console.log(`Listening on port ${port}`));