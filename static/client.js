$(document).ready(function(){
    //var ws = io.connect("ws://104.131.91.167:5000");
    var ws  = io.connect("localhost:5000");

    /*
    var connect = function connect(){
	ws = io.connect("localhost:5000");
	ws.emit("connect");
    }
    var disconnect = function disconnect(){
	ws.emit("disconnect");
    }
    ws.on("joined", function(){
	window.alert("You have connected to the server.")
    });
    */
    
    ws.on("serverMessage", function(msg){
	$("#chat").append("<p>Message from Server: " + msg + "</p>");
    });

    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", document.getElementById("chatBar").value);
	document.getElementById("chatBar").value="";
	//console.log('good');
    }

    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    if (event.keyCode == 13){
	sendMessage;
    }
    
    /*
    var con = document.getElementById("connect");
    con.addEventListener("click", sendMessage);
    var discon = document.getElementById("disconnect");
    discon.addEventListener("click", sendMessage);
    */
});
