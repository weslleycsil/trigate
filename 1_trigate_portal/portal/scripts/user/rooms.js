var user_rooms;
var ROOM_CARD =
  '<div class="col-12 col-sm-5 mx-auto">\
    <div class="trigate-card-box" id="torney-box">\
        <div class="room-header">\
            <t3 id="room-name"></t3>\
        </div>\
        <div class="room-info-design center-align">\
            <img class="room-image" id="room-image" src="" />\
        </div>\
        <div class="description-holder">\
            <p class="description-text" style="color:black" id="room-description"></p>\
        </div>\
        <div class="button-box-bottom center-align" id="button-holder">\
        </div>\
    </div>\
</div>';

var SUBSCRIBE_BUTTON =
  '<button type="button" class="btn btn-blue btn-sm w-60 mt-2 mb-2"  id="subscribe-button">Inscrever-se</button>';

var JOIN_ROOM_BUTTON =
  '<button type="button" class="btn btn-blue btn-sm w-60 mt-2 mb-2"  id="join-button">Entrar</button>';

var store_and_change_to_room = function (room_data) {
  let socket_room_id = room_data["socket_id"];
  let room_attrs = {
    "room-display-name": room_data["name"],
    "room-id": socket_room_id
  }
  change_page("RoomPanel", room_attrs);
};

var create_room_cards = function (users_data, user_rooms) {
  let room_container = $("#rooms-container");

  console.log(users_data);
  console.log(users_data["rooms"]);
  $.each(users_data["rooms"], function (room_index, room_element) {
    let new_card = $.parseHTML(ROOM_CARD);
    $(new_card).find("#room-name").html(room_element[0]["name"]);
    $(new_card).find("#room-description").html(room_element[0]["description"]);
    $(new_card)
      .find("#room-image")
      .attr("src", gallery_base_url + room_element[0]["cover_image"]);

    already_subscribed = user_rooms.indexOf(room_index) >= 0;

    if (already_subscribed) {
      let join_room_button_element = $.parseHTML(JOIN_ROOM_BUTTON);
      $(new_card).find("#button-holder").append(join_room_button_element);
      $(join_room_button_element).on("click", function () {
        store_and_change_to_room(users_data["rooms"][room_index][0]);
      });
    } else {
      let subscribe_button_element = $.parseHTML(SUBSCRIBE_BUTTON);
      $(new_card).find("#button-holder").append(subscribe_button_element);
      $(subscribe_button_element).on("click", function () {
        let json_parameters = {
          room_id: room_index,
        };
        $.ajax({
          type: "POST",
          url: api_base_url + "/rooms/subscribe",
          contentType: "application/json",
          headers: {
            Authorization: "Bearer " + stored_token,
          },
          data: JSON.stringify(json_parameters),
          success: function (data) {
            store_and_change_to_room(users_data["rooms"][room_index][0]);
          },
          error: function (data) {},
        });
      });
    }
    $(room_container).append(new_card);
  });
};

var populate_rooms = function () {
  $.ajax({
    type: "GET",
    url: api_base_url + "/rooms/get_rooms_by_user",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + stored_token,
    },
    success: function (data) {
      user_rooms = $.parseJSON(data);
      $.ajax({
        type: "GET",
        url: api_base_url + "/rooms/get_rooms",
        contentType: "application/json",
        success: function (data_rooms) {
          data_rooms = $.parseJSON(data_rooms)
          console.log(data_rooms);
          create_room_cards(data_rooms, user_rooms);
        },
        error: function (data) {},
      });
    },
    error: function (data) {},
  });
};
