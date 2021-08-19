// Dependencies
var PORT = 3000;


var express = require("express");
const fs = require('fs');
const key = fs.readFileSync('/etc/letsencrypt/live/ufsc3d.inf.ufsc.br/privkey.pem');
const cert = fs.readFileSync('/etc/letsencrypt/live/ufsc3d.inf.ufsc.br/cert.pem');

const https = require("https");

var path = require("path");
const { connected } = require("process");
var socketIO = require("socket.io");
var app = express();
const server = https.createServer({key: key, cert: cert }, app);
var io = socketIO(server);

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
  console.log("Socket " + socket.id + " joined us!");
  socket.on("send_message", function (msg) {
    socket.broadcast.emit("send_message", msg);
  });
});

