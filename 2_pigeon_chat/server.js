// Dependencies
var PORT = 3000;


var express = require("express");
const fs = require('fs');
//const key = fs.readFileSync('/etc/letsencrypt/live/ufsc3d.inf.ufsc.br/privkey.pem');
//const cert = fs.readFileSync('/etc/letsencrypt/live/ufsc3d.inf.ufsc.br/cert.pem');

const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');

const https = require("https");

var path = require("path");
const { connected } = require("process");
var socketIO = require("socket.io");
var app = express();
const server = https.createServer({key: key, cert: cert }, app);
var io = socketIO(server);
var bodyParser = require("body-parser");

const { generatemsg } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

app.set("port", PORT);
app.use(bodyParser.json());
app.use("/static", express.static(__dirname + "/newstatic"));

// Routing
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "/newstatic/index.html"));
});

//receber mensagens do mundo virtual
app.post('/message', function(req, res) {
  ret = req.body;
  /*
  username: 'UFSC3D Developer9',
  message: 'alo',
  chat: '101'
  register: false,
  */
  nMsg = generatemsg(ret.username, ret.message);
  res.json(nMsg)
  io.to(ret.chat).emit("message",nMsg);
});

// Starts the server.
server.listen(PORT, function () {
  console.log("Starting server on port " + PORT);
});

io.on("connection", (socket) => {
  console.log("new connection")

  socket.on("join", ({ username, room }, cb) => {


      const { error, user } = addUser({ id: socket.id, username, room })

      if (error) {
          return cb(error)
      }
      socket.join(user.room)
      socket.emit("message", generatemsg("Admin","Bem Vindo!"))
      socket.broadcast.to(user.room).emit("message", generatemsg("Admin", `${user.username} entrou!`))
      cb()
  })

  socket.on("sendMessage", (msg, cb) => {
      const user = getUser(socket.id)
      const mensg = generatemsg(user.username, msg);
      console.log(mensg,user.room);
      socket.broadcast.to(user.room).emit("message", mensg);
      cb("")
  })

  socket.on("disconnect", () => {
      const user = removeUser(socket.id)
      console.log(user)
      if (user) {
          io.to(user.room).emit("message", generatemsg("Admin", `${user.username} saiu`))
      }

  })


})

