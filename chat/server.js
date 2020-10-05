// Dependencies
var PORT = 3000;

var express = require("express");
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

const https = require("https");
var http = require("http").Server(app);
const { connected } = require("process");
var socketIO = require("socket.io");
var app = express();
const server = https.createServer({key: key, cert: cert }, app);
var io = socketIO(server);


app.set("port", PORT);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/", express.static(__dirname));


// Starts the server.
server.listen(PORT, function () {
  console.log("Starting server on port " + PORT);
});

io.on("connection", function (socket) {
  socket.on("send_message", function (msg) {
    socket.broadcast.emit("send_message", msg);
  });
});

