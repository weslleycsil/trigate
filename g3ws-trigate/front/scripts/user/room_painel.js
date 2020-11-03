var SCREENS = [
  {
    name: "Chat",
    object: "#chat-holder",
  },
  {
    name: "Câmera",
    object: "#camera-holder",
  },
];
var CURRENT_SCREEN = 0;

var populate_room_painel = function () {
  $(SCREENS[(CURRENT_SCREEN + 1) % 2]["object"]).hide();
  $("#button-toggle-screen").text(SCREENS[CURRENT_SCREEN]["name"]);

  $("#button-toggle-screen").on("click", function () {
    $(SCREENS[CURRENT_SCREEN]["object"]).hide();
    CURRENT_SCREEN = (CURRENT_SCREEN + 1) % 2;
    $(this).text(SCREENS[CURRENT_SCREEN]["name"]);
    $(SCREENS[CURRENT_SCREEN]["object"]).show();
  });
};
