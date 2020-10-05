const { RTCPeerConnection, RTCSessionDescription } = window;

var SOCKET;
var VIDEO_CONTAINER;
var LOCAL_VIDEO;

var CONSTRAINTS = { audio: true, video: true };
var online_users = {};
var user_count = 0;
var peerConnection = new RTCPeerConnection({
  iceServers: [{ url: "stun:stun.1.google.com:19302" }],
});

var isAlreadyCalling = false;

var insertUser = function (user_id) {
  create_user_flow(user_id, {});
};

var removeUser = function (user_id) {
  $("#user-" + user_id).remove();
  delete online_users[user_id];
  user_count--;
};

var getAllUsers = function (user_list) {
  $.each(user_list, function (key, element) {
    create_user_flow(key, {});
  });
  online_users = user_list;
  user_count = Object.keys(online_users).length;
};

var create_user_flow = function (user_id, user_data) {
  let dom_video = $.parseHTML('<button id="user-' + user_id + '">Talk with '+ user_id +'</button>');
  online_users[user_id] = user_data;
  user_count++;
  VIDEO_CONTAINER.append(dom_video);

  $(dom_video).on("click", function () {
    callUser(user_id);
  });
};

var callUser = async function (user_id) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  SOCKET.emit("call-user", { offer, to: user_id });
};
