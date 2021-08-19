console.log("Willkommen");
$("#debugger").text("Willkommen");
$(function () {
  //Initialize DOM variables
  VIDEO_CONTAINER = $("#video-container");
  LOCAL_VIDEO = $("#local-video");

  $("#debugger").text("CALLING INITIALIZE");
  initialize_media();
});
