const { RTCPeerConnection, RTCSessionDescription } = window;

var SOCKET;
var VIDEO_CONTAINER;
var LOCAL_VIDEO;

var CONSTRAINTS = { audio: true, video: true };
var SCREEN_CONSTRAINTS = { video: { cursor: "always" }, audio: false };
var online_users = {};
var user_count = 0;
var all_peers = {};

var isAlreadyCalling = false;
var cameraToggle = true;

var insertUser = function (user_id) {
  peerConstructor(user_id);
};

var removeUser = function (user_id) {
  $(all_peers[user_id]["htmlVideoObject"]).remove();
  delete all_peers[user_id];
};

var getAllUsers = function (user_list) {
  $.each(user_list, function (key, element) {
    insertUser(key);
    callUser(key);
  });
};

var callUser = async function (user_id) {
  console.log("Calling " + user_id);
  let getPeer = all_peers[user_id];
  if (getPeer["waitingConnection"] < 2) {
    const offer = await getPeer["peerConnection"].createOffer({"iceRestart": true});
    await getPeer["peerConnection"].setLocalDescription(
      new RTCSessionDescription(offer)
    );
    SOCKET.emit("call-user", { offer, to: user_id });
    getPeer["waitingConnection"]++;
  }
};

var peerConstructor = function (key) {
  if (!!!all_peers[key]) {
    let newPeerConnection = new RTCPeerConnection({
      iceServers: [{ url: 'stun:stun.l.google.com:19302?transport=udp' }],
    });
    let newObject = $.parseHTML(
      '<video id="video-' + key + '"  autoplay></video>'
    );
    $(VIDEO_CONTAINER).append(newObject);
    all_peers[key] = {
      peerConnection: newPeerConnection,
      htmlVideoId: "video-" + key,
      htmlVideoObject: newObject[0],
      waitingConnection: 0,
    };

    let stream = $("#video-local")[0].srcObject;
    // stream.getTracks().forEach((track) => newPeerConnection.addTrack(track, stream));

    let camVideoTrack = stream.getVideoTracks()[0];
    let camAudioTrack = stream.getAudioTracks()[0];
    let videoSender = newPeerConnection.addTrack(camVideoTrack, stream);
    let audioSender = newPeerConnection.addTrack(camAudioTrack, stream);

    newPeerConnection.ontrack = function ({ streams: [stream] }) {
      let remoteVideo = all_peers[key]["htmlVideoObject"];
      if (remoteVideo) {
        console.log(all_peers[key]["htmlVideoObject"])
        console.log(stream)
        remoteVideo.srcObject = stream;
      }
    };

    all_peers[key]["videoSender"] = videoSender;
    all_peers[key]["audioSender"] = audioSender;
  }
  return all_peers[key];
};

var initialize_midia = async function () {
  await get_media();
  initialize_connection();
};

var get_media = async function () {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS);
    $("#video-local")[0].srcObject = stream;
  } catch (err) {}
  return stream;
};

var get_screen = async function () {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia();
    $("#video-local")[0].srcObject = stream;
  } catch (err) {}
  return stream;
};

var toggleMedia = async function () {
  let stream = null;
  cameraToggle = !cameraToggle;
  if (cameraToggle) {
    stream = await get_media();
  } else {
    stream = await get_screen();
  }
  let newTrack = stream.getVideoTracks()[0];
  $.each(all_peers, function (key, element) {
    all_peers[key]["videoSender"].replaceTrack(newTrack);
  });
};

