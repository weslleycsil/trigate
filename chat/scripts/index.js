var message_holder;

var HTML_Encode = function (not_encoded_string) {
  let result = { object: null, filtered_message: null };
  let element = null;
  try {
    element = document.createElement("p");
    element.innerHTML = element.textContent = not_encoded_string;
    result["object"] = element;
    result["filtered_message"] = element.innerHTML;
  } catch (e) {}

  return result;
};

var send_message_flow = function () {
  let filter_message = HTML_Encode($("#text_field").val());
  let message = filter_message["filtered_message"];
  let p_element = filter_message["object"];
  if (message !== "") {
    let li_element = document.createElement("li");
    li_element.setAttribute("class", "own_message");
    li_element.appendChild(p_element);
    document.body.appendChild(li_element);
    $("#text_field").val("");

    message_holder.scrollTop = message_holder.scrollHeight;

    socket.emit("send_message", message);
  }
};

var receive_message_flow = function (message) {
  let filter_message = HTML_Encode(message);
  message = filter_message["filtered_message"];
  let p_element = filter_message["object"];
  if (message !== "") {
    let li_element = document.createElement("li");
    li_element.setAttribute("class", "other_message");
    li_element.appendChild(p_element);
    document.body.appendChild(li_element);

    message_holder.scrollTop = message_holder.scrollHeight;
  }
};

$(function () {
  var socket = io();
  message_holder = document.getElementById("message_holder");

  $(text_field)[0].addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      send_message_flow();
    }
  });

  $("#send_button").on("click", function () {
    send_message_flow();
  });

  socket.on("send_message", function (msg) {
    receive_message_flow(msg);
  });
});
