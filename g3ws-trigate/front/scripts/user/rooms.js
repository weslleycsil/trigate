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

var populate_rooms = function () {
  $.ajax({
    type: "GET",
    url: api_base_url + "/rooms/get_rooms_by_user",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + stored_token,
    },
    success: function (data) {
      user_rooms = data;
      $.ajax({
        type: "GET",
        url: api_base_url + "/rooms/get_rooms",
        contentType: "application/json",
        success: function (data_rooms) {
          create_room_cards(data_rooms, user_rooms);
        },
        error: function (data) {},
      });
    },
    error: function (data) {},
  });
};

var create_room_cards = function (users_data, user_rooms) {
  let room_container = $("#rooms-container");
  $.each(users_data["rooms"], function (room_index, room_element) {
    let new_card = $.parseHTML(ROOM_CARD);
    $(new_card).find("#room-name").html(room_element[0]["name"]);
    $(new_card)
      .find("#room-description")
      .html(room_element[0]["description"]);
    $(new_card).find("#room-image").attr("src",gallery_base_url + room_element[0]["cover_image"]);

    already_subscribed = user_rooms.indexOf(room_index) >= 0;

    if (already_subscribed) {
      let bet_button_element = $.parseHTML(JOIN_ROOM_BUTTON);
      $(new_card).find("#button-holder").append(bet_button_element);
      $(bet_button_element).on("click", function () {
        change_page("RoomPanel", room_index);
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
            change_page("Lessons", room_index);
          },
          error: function (data) {},
        });
      });
    }
    $(room_container).append(new_card);
  });
};
