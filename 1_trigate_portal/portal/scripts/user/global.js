// GLOBAL VARIABLES

var base_url = "https://ufsc3d.inf.ufsc.br/developer1_5.2";
var api_base_url = base_url + "/api";
var gallery_base_url = base_url + "/gallery/";

var stored_token;
var stored_optional_attr;
var menu_window = $("#menu-viewer");
var menu_button = $("#menu-button");
var menu_box = $("#menu-box");
var root_page = "Rooms";

// GLOBAL METHODS

var show_menu = function () {
  $(menu_window).show();
};

var hide_menu = function () {
  $(menu_window).hide();
};

var toggle_menu_box = function () {
  $(menu_box).slideToggle();
};

var hide_menu_box = function () {
  $(menu_box).hide();
};

var clean_session = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("last_page");
  localStorage.removeItem("optional_attr");
};

var get_optional_attr_object = function () {
  if (!stored_optional_attr) {
    stored_optional_attr = JSON.parse(localStorage.getItem("optional_attr"));
    stored_optional_attr = stored_optional_attr ? stored_optional_attr : {};
  }
  return stored_optional_attr;
};

var store_optional_attr = function (key, value) {
  stored_optional_attr[key] = value;
  localStorage.setItem("optional_attr", JSON.stringify(stored_optional_attr));
};

var get_optional_attr = function (key) {
  let response;
  try {
    response = stored_optional_attr[key];
  } catch (e) {
    response = "";
  }
  return response;
};

function startCountdown() {
  if (stored_token) {
    let exp_time = parseJwt(stored_token)["exp"] * 1000;
    let current_time = Date.now();
    let countdown_time = exp_time - current_time;
    if (countdown_time > 0) {
      setTimeout(function () {
        change_page("Login");
      }, countdown_time);
    } else {
      change_page("Login");
    }
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
