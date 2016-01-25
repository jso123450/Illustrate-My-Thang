/* --------------------------- DRAWING & FORMATTING -----------------------*/
// Boolean that determines whether or not the client is the drawer
var drawer = false;

// The timer countdown variable
var countdown = 60;

// Setting up the Drawing Canvas
var canvas = document.getElementById("drawcanvas");
var context = canvas.getContext("2d");
context.strokeStyle="black";
context.lineWidth="5";
var rect = canvas.getBoundingClientRect(); 

// Boolean that determines whether or not you can draw
var isDrawing = false;

// Getting the Drawing Tools
var pencil = document.getElementById("pencil");
var eraser = document.getElementById("eraser");
var blue = document.getElementById("blue");
var red = document.getElementById("red");
var green = document.getElementById("green");
var yellow = document.getElementById("yellow");

// Variables that will be used to track mouse movement
var xPos;
var yPos;
var lastX;
var lastY;

// If drawing, set the boolean to true, and the mouse cursor accordingly
var drawing = function drawing(e){
    canvas.style.cursor="crosshair";
    isDrawing=true;
};

// If not drawing, set the boolean to false, and the mouse cursor accordingly
var notDraw = function notDraw(e){
    canvas.style.cursor="default";
    isDrawing=false;
    
};

/* ------------------------ SocketIO ------------------------------- */
// Upon loading the page
$(document).ready(function(){

    /* ----------------- VARIABLES ------------------ */

    // Retrieve the Timer and format it
    var timer = document.getElementById("timer");
    var timerC = timer.getContext("2d");
    timer.style.left = "800px";
    timerC.font="30px Impact";
    
    // Connects to the Server on port 5000

    var ws  = io.connect("illustratemythang.chickenkiller.com:5000");
    //var ws = io.connect("localhost:5000")
    // The default userID (which will be changed)
    var userID = -1;
    
    // Asks for the client's name
    var name = "";
    var person = prompt("Please enter your name");

    // The current word assigned to the drawer
    var word="";

    // Boolean of has the game started yet?
    var started = false;

    // Boolean of is the round buffering (transitioning)?
    var buffer = false;

    /* ------------- GAME DYNAMICS/SETUP ---------------- */

    // Function that will start the timer upon game start
    var timerInterval = setInterval(function(){
	if (started){
	    if (countdown < 0){
		// Removes the drawer privileges of the previous drawer
		timerC.fillStyle = "white";
		canvas.removeEventListener("mousemove",changeColor);
		canvas.removeEventListener("mousedown",drawing);
		canvas.removeEventListener("mouseup",notDraw);
		canvas.style.cursor="default";
		if (drawer){
		    // if not buffering already, then buffer
		    if (!buffer){
			ws.emit("roundBuffer");
		    } else {
			// set buffer to false and setup the round
			buffer = false;
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
	console.log(person);
	ws.emit("joined",person);
	person;
	name = person;
    }
    
    // When the window is loaded, call joined to set up the client on the server side
    $(window).load(joined);

    // Forces client to disconnect if there are already 5 clients connected
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

    // Change the color of the drawing
    var changeColor = function changeColor(event){
	var rect = canvas.getBoundingClientRect(); 
	xPos = (event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
	yPos = (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	// Transmit the coordinates of where the drawer just placed a color
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

    
    // Assign the client's userID
    ws.on("drawerID", function(numID){
	userID = numID;
	ws.emit("roundSetup");
    });

    // Send a server message saying someone has connected
    ws.on('chatAlert', function(person){
	$("#chat").append("<div class='chat-box-left'>"+person+" has joined.</div><div class='chat-box-name-left'>Server Message</div><hr class='hr-clas'/>");
    });

    // Send a server message saying someone has disconnected
    ws.on('chatAlertDC', function(person){
	$("#chat").append("<div class='chat-box-left'>"+person+" has left.</div><div class='chat-box-name-left'>Server Message</div><hr class='hr-clas'/>");
    });

    // Update the list of people currently connected
    ws.on('peopleOnline', function(data){
	console.log(data);
	$("#people").html("");
	for(i=0; i<data[0].length;i++){
	    $("#people").append("<li><a href='#'><span class='fa fa-circle-o-notch'></span>&nbsp;"+data[0][i]+": "+data[1][data[2][i]]+"</a></li><li class='divider'></li>")
	}
    });	
	
    // Setup the second round of the game
    ws.on("roundSetup2", function(data){
	// Clears the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (userID == data[0]){
	    drawer = true;
	    $("#heading").html("<h1> Illustrate My Thang </h1>");
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

    // Restart the timer
    ws.on("roundStart2", function(){
	countdown=60;
	started=true;
    });

    // Buffering for rounds in the second loop
    ws.on("roundBuffer2", function(){
	console.log("buffer");
	countdown=5;
	buffer=true;
	$("#heading").html("<h1> Illustrate My Thang </h1><h2>The word was "+word+"</h2>");
    });
    
    // After a message is sent to the server and the server broadcasts the message,
    // the message and the sender is added to the chat box
    ws.on("serverMessage", function(data){
	console.log(data.winner);
	if (data.winner){
	    $("#chat").append("<div class='chat-box-left'>"+data.nam+" guessed the word!</div><div class='chat-box-name-left'>Server Message</div><hr class='hr-clas'/>");
	    if(userID==data.uID){
		ws.emit("roundBuffer");
	    }
	} else {
	    $("#chat").append("<div class='chat-box-right'>"+data.msg+"</div><div class='chat-box-name-right'>"+data.nam+"</div><hr class='hr-clas'/>");
	}
    });

    //Sends the server the name and message of the client
    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", {msg: document.getElementById("chatBar").value, nam: name, winner: false, uID: userID, dID: drawer});
	document.getElementById("chatBar").value="";
    }

    // Event Listener for Sending Messages
    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    $("#chatBar").keyup(function(e){
	if(event.keyCode == 13){
            $("#sendMsg").click();
	}
    });
    
    // Sends a message when somebody disconnects
    window.onunload = function leaving(){
	ws.emit("disconnected",[userID,name]);
    }

    /*
    ws.on("test", function(data){
	console.log(data);
    }); */

    // Logic that tracks Drawing
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


