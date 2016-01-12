$(document).ready(function(){
    //var ws = io.connect("ws://104.131.91.167:5000");
    
    var ws = io.connect("localhost:5000");

    ws.on("serverMessage", function(msg){
	$("#chat").append("<p>message from server: " + msg + "</p>");
    });

    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", document.getElementById("chatBar").value);
	document.getElementById("chatBar").value="";
	//console.log('good');
    }

    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
});
