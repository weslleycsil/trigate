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

var populate_room_painel = function () {
  $("#room-name").text("Sala " + get_optional_attr("room-display-name"))
  $("#broadcast-frame-holder").attr(
	"src", "https://ufsc3d.inf.ufsc.br:8080?room-id=" + get_optional_attr("room-id")
  );
console.log("working");
  $("#broadcast-frame-holder").attr("allowusermedia", true);
  $("#broadcast-frame-holder").attr("allow", "camera *;microphone *;fullscreen *");
  $(SCREENS[(CURRENT_SCREEN + 1) % 2]["object"]).hide();
  $("#button-toggle-screen").text(SCREENS[CURRENT_SCREEN]["name"]);

  $("#button-toggle-screen").on("click", function () {
    $(SCREENS[CURRENT_SCREEN]["object"]).hide();
    CURRENT_SCREEN = (CURRENT_SCREEN + 1) % 2;
    $(this).text(SCREENS[CURRENT_SCREEN]["name"]);
    $(SCREENS[CURRENT_SCREEN]["object"]).show();
  });
};

