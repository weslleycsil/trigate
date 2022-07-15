var message_holder;
var message_panel;
var socket;


var HTML_skip_Encode = function (encoded_string) {
    var result = { object: null, filtered_message: null };
    var element = null;
    try {
        let createdAt = new Date().getTime();

        elementName = document.createElement("div");
        elementName.className = "msg-info-name";
        elementName.innerText = encoded_string.username;
        elementTime = document.createElement("div");
        elementTime.className = "msg-info-time";
        elementTime.innerText = moment(encoded_string.createdAt).format('h:m A, DD MMM,YYYY');
        element = document.createElement("div");
        element.className = "msg-info";
        element.appendChild(elementName);
        element.appendChild(elementTime);

        elementB = document.createElement("div");
        elementB.className = "msg-bubble";
        elementB.appendChild(element);

        //div da mensagem
        element = document.createElement("div");
        element.className = "msg-text";
        element.innerText = encoded_string.text;
        elementB.appendChild(element);
        
        result["object"] = elementB; //messageBuble
        result["filtered_message"] = encoded_string.text;
    } catch (e) {}
  
    return result;
};

var HTML_Encode = function (not_encoded_string) {
    var result = { object: null, filtered_message: null };
    var element = null;
    try {
        //rever essa função de encoded
        var encoded_string = not_encoded_string.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
        let createdAt = new Date().getTime();

        elementName = document.createElement("div");
        elementName.className = "msg-info-name";
        elementName.innerText = "Você";
        elementTime = document.createElement("div");
        elementTime.className = "msg-info-time";
        elementTime.innerText = moment(createdAt).format('h:m A, DD MMM,YYYY');
        element = document.createElement("div");
        element.className = "msg-info";
        element.appendChild(elementName);
        element.appendChild(elementTime);

        elementB = document.createElement("div");
        elementB.className = "msg-bubble";
        elementB.appendChild(element);

        //div da mensagem
        element = document.createElement("div");
        element.className = "msg-text";
        element.innerText = encoded_string;
        elementB.appendChild(element);
        
        result["object"] = elementB; //messageBuble
        result["filtered_message"] = encoded_string;
    } catch (e) {}
  
    return result;
};

var send_message_flow = function () {
    var filter_message = HTML_Encode($("#msgerInput").val());
    var message = filter_message["filtered_message"];
    console.log(message)
    if (message !== "") {
        var div_element = filter_message["object"];
        //criar div left
        let divLeft = document.createElement("div");
        divLeft.className = "msg left-msg";
        divLeft.appendChild(div_element);
        //adicionar no chat

        message_panel.appendChild(divLeft);
        $("#msgerInput").val("");
        message_panel.scrollTop = message_panel.scrollHeight;


        socket.emit("sendMessage", message, (error)=> {
            if (error) {
            return console.log(error)
            }
        });
    }
}

var receive_message_flow = function (message) {
    console.log(message)
    var filter_message = HTML_skip_Encode(message);
    message = filter_message["filtered_message"];
    if (message !== "") {
        var div_element = filter_message["object"];//criar div right
        let divRight = document.createElement("div");
        divRight.className = "msg right-msg";
        divRight.appendChild(div_element);
        //adicionar no chat
        message_panel.appendChild(divRight);
        $("#msgerInput").val("");
        message_panel.scrollTop = message_panel.scrollHeight
    }
}


$(function () {
    socket = io();
  
    //obter informações de sala e username
    let params = new URLSearchParams(location.search);
    username = params.get("user");
    room = params.get("chat");
  
    socket.emit('join', { username, room }, (error) => {
      if (error) {
          alert(error)
          location.href = 'https://trigate.com'
      }
    })
  
    message_panel = document.getElementById("msgerChat");
    //message_panel = document.getElementById("messages");
  
    $(msgerInput)[0].addEventListener("keyup", function (event) {
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
  
    socket.on("message", function (msg) {
      console.log(msg)
      receive_message_flow(msg);
    });
  });