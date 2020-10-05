// Connection Stuffs

var initialize_connection = function () {
  SOCKET = io();

  SOCKET.on("update-new-user", function (data) {
    insertUser(data["user"]);
  });

  SOCKET.on("update-remove-user", function (data) {
    removeUser(data["user"]);
  });

  SOCKET.on("get-room-users", function (data) {
    getAllUsers(data["users"]);
  });

  // PROBLEM

  SOCKET.on("call-made", async (data) => {
      console.log("User " + data.socket + " is calling")
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    SOCKET.emit("make-answer", {
      answer,
      to: data.socket,
    });
  });

  SOCKET.on("answer-made", async (data) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
    if (!isAlreadyCalling) {
      callUser(data.socket);
      isAlreadyCalling = true;
    }
  });

  peerConnection.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  };
};
