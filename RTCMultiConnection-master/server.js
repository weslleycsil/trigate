// Dependencies
var PORT = 9000;

var express = require("express");
const fs = require("fs");
const key = fs.readFileSync("./keys/key.pem");
const cert = fs.readFileSync("./keys/cert.pem");

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
app.use("/demo", express.static(__dirname + "/demo"));

// Routing
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "/demo/index.html"));
});

// Starts the server.
server.listen(PORT, function () {
  console.log("Starting server on port " + PORT);
});


// --------------------------
// socket.io codes goes below

ioServer(httpApp).on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket, config);

    // ----------------------
    // below code is optional

    const params = socket.handshake.query;

    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
    });
});
