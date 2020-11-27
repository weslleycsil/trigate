var CONNECTION;
var ROOM_ID;

var setup_connection = function () {
  CONNECTION = new RTCMultiConnection();
  CONNECTION.socketURL = "/";
  CONNECTION.socketMessageEvent = "video-broadcast";
  CONNECTION.session = {
    audio: true,
    screen: true,
    oneway: true,
  };
  CONNECTION.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false,
  };
  CONNECTION.iceServers = [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302?transport=udp",
      ],
    },
  ];

  CONNECTION.videosContainer = document.getElementById("videos-container");
  CONNECTION.onstream = function (event) {
    var existing = document.getElementById(event.streamid);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    event.mediaElement.removeAttribute("src");
    event.mediaElement.removeAttribute("srcObject");
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement("video");

    try {
      video.setAttributeNode(document.createAttribute("autoplay"));
      video.setAttributeNode(document.createAttribute("playsinline"));
    } catch (e) {
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
    }

    if (event.type === "local") {
      video.volume = 0;
      try {
        video.setAttributeNode(document.createAttribute("muted"));
      } catch (e) {
        video.setAttribute("muted", true);
      }
    }
    video.srcObject = event.stream;

    var width = parseInt(CONNECTION.videosContainer.clientWidth / 3) - 20;
    var mediaElement = getHTMLMediaElement(video, {
      title: event.userid,
      buttons: ["full-screen"],
      width: width,
      showOnMouseEnter: false,
    });

    CONNECTION.videosContainer.appendChild(mediaElement);

    setTimeout(function () {
      mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;
  };

  CONNECTION.onstreamended = function (event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);

      if (event.userid === CONNECTION.sessionid && !CONNECTION.isInitiator) {
        alert(
          "Broadcast is ended. We will reload this page to clear the cache."
        );
      }
    }
  };

  CONNECTION.onMediaError = function (e) {
    if (e.message === "Concurrent mic process limit.") {
      if (DetectRTC.audioInputDevices.length <= 1) {
        alert(
          "Please select external microphone. Check github issue number 483."
        );
        return;
      }

      var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
      CONNECTION.mediaConstraints.audio = {
        deviceId: secondaryMic,
      };

      CONNECTION.join(CONNECTION.sessionid);
    }
  };

  reCheckRoomPresence();
};

var reCheckRoomPresence = function () {
  CONNECTION.checkPresence(ROOM_ID, function (isRoomExist) {
    if (isRoomExist) {
      CONNECTION.join(ROOM_ID);
      return;
    }
    setTimeout(reCheckRoomPresence, 5000);
  });
};

var setup_room = function () {
  ROOM_ID = getUrlParameter("room-id");
  CONNECTION.openOrJoin(ROOM_ID, function (isRoomExist, ROOM_ID) {
    if (isRoomExist) {
      CONNECTION.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      };
    }
  });
};

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};

var reconnect = function () {
  setTimeout(function () {
    console.log("TRYING TO RECONNECT");
    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };
    console.log(connection.join(ROOM_ID));
    console.log("RECONNECT PERFORMED");
    // reconnect();
  }, 5000);
};

var initialize = function () {
  setup_connection();
  setup_room();
};

initialize();
