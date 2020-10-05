var get_media = async function (constraints) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById("local-video").srcObject = stream;

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  } catch (err) {}

  return stream;
};