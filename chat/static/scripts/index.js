// var message_holder;
// var message_panel;
// var socket;

var print = function(msg){
  document.getElementById("demo-text").innerHTML += "<br/>"+msg;
}
print("ATLEAST JAVASCRIPT IS WORKING");

var HTML_skip_Encode = function (encoded_string) {
    let result = { object: null, filtered_message: null };
    let element = null;
    try {
      element = document.createElement("p");
      element.innerHTML = element.textContent = encoded_string;
      result["object"] = element;
      result["filtered_message"] = encoded_string;
    } catch (e) {}
  
    return result;
  };

// var HTML_Encode = function (not_encoded_string) {
//   let result = { object: null, filtered_message: null };
//   let element = null;
//   try {
//     let encoded_string = not_encoded_string.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
//         return '&#'+i.charCodeAt(0)+';';
//      });
//     element = document.createElement("p");
//     element.innerHTML = element.textContent = encoded_string;
//     result["object"] = element;
//     result["filtered_message"] = encoded_string;
//   } catch (e) {}

//   return result;
// };

// var send_message_flow = function () {
//   let filter_message = HTML_Encode($("#text_field").val());
//   let message = filter_message["filtered_message"];
//   let p_element = filter_message["object"];
//   if (message !== "") {
//     let li_element = document.createElement("li");
//     li_element.setAttribute("class", "own_message");
//     li_element.appendChild(p_element);
//     message_panel.appendChild(li_element);
//     $("#text_field").val("");

//     message_holder.scrollTop = message_holder.scrollHeight;

//     print("ALMOST SENDING MESSAGE");
//     socket.emit("send_message", message);
//     print("MESSAGE SENT!");
//   }
// };

// var receive_message_flow = function (message) {
//   let filter_message = HTML_skip_Encode(message);
//   message = filter_message["filtered_message"];
//   let p_element = filter_message["object"];
//   if (message !== "") {
//     let li_element = document.createElement("li");
//     li_element.setAttribute("class", "other_message");
//     li_element.appendChild(p_element);
//     message_panel.appendChild(li_element);

//     message_holder.scrollTop = message_holder.scrollHeight;
//   }
// };

print("I'M JAVASCRIPT BITCH!");

// $(function () {
//   socket = io();
//   print("JQUERY STARTER");
//   print(socket);
//   message_holder = document.getElementById("message_holder");
//   message_panel = document.getElementById("messages");

//   $(text_field)[0].addEventListener("keyup", function (event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.keyCode === 13) {
//       // Cancel the default action, if needed
//       event.preventDefault();
//       send_message_flow();
//     }
//   });

//   $("#send_button").on("click", function () {
//     print("SENDING MESSAGE");
//     send_message_flow();
//   });

//   socket.on("send_message", function (msg) {
//     receive_message_flow(msg);
//   });
// });
