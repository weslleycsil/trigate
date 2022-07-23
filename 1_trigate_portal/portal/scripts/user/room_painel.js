var SCREENS = [
  {
    name: "Trocar para Câmera",
    object: "#chat-holder",
  },
  {
    name: "Trocar para Chat",
    object: "#camera-holder",
  },
];
var CURRENT_SCREEN = 0;

var start_presentation = function(){
  let current_url_room = "https:///ufsc3d.inf.ufsc.br:8080/?room-id=" + get_optional_attr("room-id");
  window.open(current_url_room);
}

var populate_room_painel = function () {
  $("#room-name").text("Sala " + get_optional_attr("room-display-name"))

  //$("#broadcast-frame-holder").attr("src", "https://ufsc3d.inf.ufsc.br:8080?room-id=" + get_optional_attr("room-id"));
  //$("#broadcast-frame-holder").attr("src", "https://test.webrtc.org/");

  let current_url_room = "https://video.trigate.twcreativs.com.br/?room-id=" + get_optional_attr("room-id");
  let iframe_video = '\
  	<iframe class="camera-holder"\
  		id="broadcast-frame-holder"\
  		src="' + current_url_room + '" \
		allow="display-capture *; camera *; microphone *; fullscreen *"\
	</iframe>';

  //recuperar username
  let userLogin = localStorage.getItem("username");
  let iframe_chat = '\
    <iframe class="chat-holder chato"\
    src="https://ufsc3d.inf.ufsc.br:3000/?chat='+ get_optional_attr("room-id") +'&user='+ userLogin +'"\
  ></iframe>';



  $("#camera-holder").append(iframe_video);
  $("#chat-holder").append(iframe_chat);
//  $("#broadcast-frame-holder").attr("allowusermedia", true);
//  $("#broadcast-frame-holder").attr("allow", "autoplay * ; playsinline * ; camera * ; microphone * ; fullscreen *");

  $(SCREENS[(CURRENT_SCREEN + 1) % 2]["object"]).hide();

  $("#button-toggle-screen").text(SCREENS[CURRENT_SCREEN]["name"]);

  $("#button-toggle-screen").on("click", function () {
    $(SCREENS[CURRENT_SCREEN]["object"]).hide();
    CURRENT_SCREEN = (CURRENT_SCREEN + 1) % 2;
    $(this).text(SCREENS[CURRENT_SCREEN]["name"]);
    $(SCREENS[CURRENT_SCREEN]["object"]).show();
  });
};
