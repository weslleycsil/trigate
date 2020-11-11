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
    console.log("call-made (making answer) " + data.socket);
    console.log(all_peers[data.socket])
    let getPeer = all_peers[data.socket];
    await getPeer["peerConnection"].setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );
    const answer = await getPeer["peerConnection"].createAnswer();
    await getPeer["peerConnection"].setLocalDescription(
      new RTCSessionDescription(answer)
    );
    getPeer["peerConnection"].iceConnectionState === "failed") {
      console.log("THIS FAILED");
      getPeer["peerConnection"].restartIce();
    }

    console.log("CALL-MADE IS NOT DEAD")
    console.log(getPeer["peerConnection"]) 
    SOCKET.emit("make-answer", {
      answer,
      to: data.socket,
    });
  });

  SOCKET.on("answer-made", async (data) => {
    console.log("answer-made (call-user) " + data.socket);
    let getPeer = all_peers[data.socket];
    await getPeer["peerConnection"].setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
    console.log("ANSWER-MADE IS NOT DEAD")
    console.log(getPeer["peerConnection"])
    callUser(data.socket);
  });
};
