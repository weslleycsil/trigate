var ready_function = function () {
  stored_token = localStorage.getItem("token");
  get_optional_attr_object();
  menu_window = $("#menu-viewer");
  menu_button = $("#menu-button");
};

var change_page = function (page, optional_attr) {
  hide_menu_box();
  switch (page) {
    case "Login":
      clean_session();
      localStorage.setItem("last_page", "Login");
      hide_menu();
      change_route("Login");
      after_load = function () {};
      break;
    case "FinishRegisterFlow":
      localStorage.removeItem("optional_attr");
      localStorage.setItem("last_page", "Login");
      hide_menu();
      change_route("Login");
      after_load = function () {
        change_code_page();
      };
      break;
    case "Rooms":
      localStorage.setItem("last_page", "Rooms");
      show_menu();
      change_route("Rooms");
      after_load = function () {
        populate_rooms();
      };
      break;
    case "RoomPanel":
      localStorage.setItem("last_page", "RoomPanel");
      show_menu();
      change_route("RoomPanel");
      after_load = function () {
        populate_room_painel();
      };
      break;
  }
};
