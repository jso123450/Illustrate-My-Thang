/* --------------------------- DRAWING & FORMATTING -----------------------*/
var drawer = false;
var countdown = 60;
var canvas = document.getElementById("drawcanvas");
var context = canvas.getContext("2d");
context.strokeStyle="black";
context.lineWidth="5";
var rect = canvas.getBoundingClientRect(); 

var isDrawing = false;

var pencil = document.getElementById("pencil");

var eraser = document.getElementById("eraser");

var blue = document.getElementById("blue");

var red = document.getElementById("red");

var green = document.getElementById("green");

var yellow = document.getElementById("yellow");

var xPos;
var yPos;
var lastX;
var lastY;

var drawing = function drawing(e){
    canvas.style.cursor="crosshair";
    isDrawing=true;
};

var notDraw = function notDraw(e){
    canvas.style.cursor="default";
    isDrawing=false;
    
};
/* ------------------------ SocketIO ------------------------------- */
$(document).ready(function(){
    //var ws = io.connect("ws://104.131.91.167:5000");

    var timer = document.getElementById("timer");
    var timerC = timer.getContext("2d");
    timer.style.left = "800px";
    //timer.style.top = "20px";
    //timer.style.position = "absolute";
    timerC.font="30px Impact";
    
    //load on connection
    var ws  = io.connect("localhost:5000");//connects to localhost until server is ready
    var userID = -1; //creates default value for id number
    var name = "";
    var person = prompt("Please enter your name");//asks user to type in a name
    var word="";
    var started=false;
    var buffer=false;
    var points=0;
    var timerInterval = setInterval(function(){
	if (started){
	    if (countdown < 0){
		//clearInterval(timerInterval);
		timerC.fillStyle = "white";
		canvas.removeEventListener("mousemove",changeColor);
		canvas.removeEventListener("mousedown",drawing);
		canvas.removeEventListener("mouseup",notDraw);
		canvas.style.cursor="default";
		if (drawer){
		    if (!buffer){
			//ws.emit("roundSetup");
			ws.emit("roundBuffer");
		    } else {
			buffer=false;
			ws.emit("roundSetup");
		    }
		}
	    } else {
		timerC.fillStyle = "blue";
		timerC.arc(50,50,40,0,360);
		timerC.fill();
		timerC.fillStyle = "white";
		if (countdown < 10){
		    timerC.fillText(countdown,40,60);
		}
		else{
		    timerC.fillText(countdown,35,60);
		}
	    }
	}
	countdown-=1;
    },1000);
    
    //When called, function will tell server the client has joined and prompts user for a name
    var joined = function joined(){
	ws.emit("joined");
	person;
	name = person;
    }
    $(window).load(joined);//When window is loaded, call joined to set up client on server side
    //Forces client to disconnect if there are already 5 clients connected
    ws.on("tooMany", function(){
	console.log("toomany");
	$("#heading").html("<h1>GAME ROOM IS FULL. PLEASE TRY LATER</h1>");
	ws.disconnect();
    });
    ws.on("gameStarted",function(){
	console.log("game has started.can't join");
	$("#heading").html("<h1>GAME HAS ALREADY STARTED. PLEASE TRY LATER </h1>");
	ws.disconnect();
    });
    var changeColor = function changeColor(event){
	var rect = canvas.getBoundingClientRect(); 
	
	xPos=(event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
	yPos=(event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	ws.emit("coordinates",{"x":xPos,"y":yPos,"color": context.strokeStyle, "width": context.lineWidth,"isDrawing": isDrawing});
	if (isDrawing){
	    context.beginPath();
	    context.lineJoin="round";
	    context.moveTo(lastX,lastY);
	    context.lineTo(xPos,yPos);
	    context.closePath();
	    context.stroke();
	};
	lastX = xPos;
	lastY = yPos;
    };
    //round/game setup
    ws.on("drawerID", function(numID){
	userID = numID;
	console.log(userID);
	ws.emit("roundSetup");
    });
    ws.on("roundSetup2", function(data){
	console.log(data[1]);
	if (userID == data[0]){
	    drawer = true;
	    $("#heading").append($("<h2>The word is "+data[1]+"</h2>"));
	    pencil.addEventListener("mousedown",function(e){
		context.lineWidth="6";
		context.strokeStyle="black";
	    });
	    eraser.addEventListener("mousedown",function(e){
		context.strokeStyle="white";
		context.lineWidth="15";
	    });
	    red.addEventListener("mousedown",function(e){
		context.strokeStyle="red";
		context.lineWidth="6";
	    });
	    blue.addEventListener("mousedown",function(e){
		context.strokeStyle="blue";
		context.lineWidth="6";
	    });
	    green.addEventListener("mousedown",function(e){
		context.strokeStyle="green";
		context.lineWidth="6";
	    });
	    yellow.addEventListener("mousedown",function(e){
		context.strokeStyle="yellow";
		context.lineWidth="6";
	    });
	    canvas.addEventListener("mousemove",changeColor);
	    canvas.addEventListener("mousedown",drawing);
	    canvas.addEventListener("mouseup",notDraw);
	    canvas.addEventListener("mouseout",notDraw);
	    ws.emit("roundStart");
	} else {
	    drawer = false;
	    $("#heading").html("<h1> Illustrate My Thang </h1>");
	}
	word=data[1];
    });
    ws.on("roundStart2", function(){
	countdown=60;
	started=true;
    });
    ws.on("roundBuffer2", function(){
	console.log("buffer");
	countdown=5;
	buffer=true;
    });
    
    //After a message is sent to the server and the server broadcasts the message,
    //the message and the sender is added to the chat box
    ws.on("serverMessage", function(data){
	//$("#chat").append("<li class='list-group'>" + data.nam + ": " + data.msg + "</li>");
	$("#chat").append("<div class='chat-box-left'>"+data.msg+"</div><div class='chat-box-name-left'>"+data.nam+"</div><hr class='hr-clas'/>");
	if (data.winner){
	    if(userID==data.uID){
		point++;
		ws.emit("roundBuffer");
	    }
	}
    });
    //Sends the server the name and message of the client
    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", {msg: document.getElementById("chatBar").value, nam: name, winner: false, uID: userID, dID: drawer});
	document.getElementById("chatBar").value="";
    }
    //event listeners
    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    
    window.onunload = function leaving(){
	ws.emit("disconnected",userID);
    }
    ws.on("test", function(data){
	console.log(data);
    });
    ws.on("drawing",function(coordData){
	if (!drawer){
	    xPos = coordData[0];
	    yPos = coordData[1];
	    if ( coordData[4]){
		context.lineWidth = coordData[3];
		context.strokeStyle = coordData[2];
		console.log(xPos+" "+yPos);
		context.beginPath();
		context.lineJoin="round";
		context.moveTo(lastX,lastY);
		context.lineTo(xPos,yPos);
		context.closePath();
		context.stroke();
	    };
	    lastX = xPos;
	    lastY = yPos;
	};
    });
});


