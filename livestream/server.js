// Dependencies
var PORT = 8080;

var express = require("express");
const fs = require("fs");
const key = fs.readFileSync("./key.pem");
const cert = fs.readFileSync("./cert.pem");

const https = require("https");

var http = require("http");
var path = require("path");
const { connected } = require("process");
var socketIO = require("socket.io");
var app = express();
const server = https.createServer({ key: key, cert: cert }, app);
var io = socketIO(server);

var active_users = {};

app.set("port", PORT);
app.use("/static", express.static(__dirname + "/static"));

// Routing
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "/static/index.html"));
});

// Starts the server.
server.listen(PORT, function () {
  console.log("Starting server on port " + PORT);
});

io.on("connection", function (socket) {
  initialize_socket(socket);

  socket.on("call-user", function (data) {
    console.log(socket.id + " IS CALLING " + data.to);
    socket.to(data.to).emit("call-made", {
      offer: data.offer,
      socket: socket.id,
    });
  });

  socket.on("make-answer", (data) => {
    console.log(socket.id + " IS ANSWERING " + data.to);
    socket.to(data.to).emit("answer-made", {
      socket: socket.id,
      answer: data.answer,
    });
  });

  socket.on("disconnect", function () {
    delete active_users[socket.id];
    socket.broadcast.emit("update-remove-user", {
      user: socket.id,
    });
    console.log("User [" + socket.id + "] left the server");
  });
});

var initialize_socket = function (socket) {
  socket.emit("get-room-users", {
    users: active_users,
  });

  socket.broadcast.emit("update-new-user", {
    user: socket.id,
  });

  active_users[socket.id] = "Alive";
};
