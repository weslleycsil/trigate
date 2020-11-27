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
  $("#broadcast-frame-holder").attr("src", "https://g3ws.dev.br:8080" + get_optional_attr_object("room-id"));
  $(SCREENS[(CURRENT_SCREEN + 1) % 2]["object"]).hide();
  $("#button-toggle-screen").text(SCREENS[CURRENT_SCREEN]["name"]);

  $("#button-toggle-screen").on("click", function () {
    $(SCREENS[CURRENT_SCREEN]["object"]).hide();
    CURRENT_SCREEN = (CURRENT_SCREEN + 1) % 2;
    $(this).text(SCREENS[CURRENT_SCREEN]["name"]);
    $(SCREENS[CURRENT_SCREEN]["object"]).show();
  });
};
