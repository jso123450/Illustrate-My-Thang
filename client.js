$(document).ready(function(){
    var ws = io.connect("ws://104.131.91.167:5000");

    ws.on("serverMessage", function(msg){
	$("chat").append("<p>message from server: " + msg + "</p>");
    });

    function sendMessage(){
	ws.emit("clientMessage", );
    }
});
