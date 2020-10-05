console.log("Willkommen");

$(function () {
  //Initialize DOM variables
  VIDEO_CONTAINER = $("#video-container");
  LOCAL_VIDEO = $("#local-video");

  get_media(CONSTRAINTS);
  initialize_connection();
});
