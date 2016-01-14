$(document).ready(function(){
    //var ws = io.connect("ws://104.131.91.167:5000");
    
    //load on connection
    var ws  = io.connect("localhost:5000");
    var id = -1;
    var name = "";
    var person = prompt("Please enter your name");
    
    var joined = function joined(){
	//console.log("doing");
	ws.emit("joined", "testip");
	person;
	name = person;
	//console.log(name);
    }
    $(window).load(joined);
    ws.on("tooMany", function(){
	console.log("toomany");
	ws.disconnect();
    });

    //round/game setup
    ws.on("drawerID", function(idNumber){
	id = idNumber;
	if (id == 4){
	    ws.emit("gameStart")
	}
    });

    //chat
    ws.on("serverMessage", function(data){
	$("#chat").append("<p>" + data.nam + ": " + data.msg + "</p>");
    });

    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", {msg: document.getElementById("chatBar").value, nam: name});
	document.getElementById("chatBar").value="";
	//console.log('good');
    }

    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    //enter key submission not working
    if (event.keyCode == 13){
	sendMessage;
    }
});
