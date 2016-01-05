window.onload = function(){
    var form = document.getElementById('chat');
    var messageField = document.getElementById('message');
    var messagesList = document.getElementById('messages');
    

    var socket = new WebSocket('ws://104.131.91.167');
    
    form.onsubmit = function(e){
	e.preventDefault();
	var message = messageField.value;
	socket.send(message)
	
	return false;
    };

    messagesList.innerHTML += "<li>"+socket.readyState+"</li>";
    socket.onerror = function(e){
	messagesList.innerHTML += "<li> something wrong </li>";
    };
    socket.onmessage = function(event){
	var message = event.data;
	messagesList.innerHTML += "<li>"+message+"</li>";
    };
};
