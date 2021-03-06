# Illustrate My Thang (Alpha Version 1.0)

# Development Team Members
- each member was mainly responsible for his parts of the project, but did contribute to other parts as well that may not be fully tracked by commits (working on the same computers, etc.)
- <b>Johnny So</b> : Styling, Middleware, Coordinating the Group (code structure, layout, method)
- <b>Ho Yin Ho</b> : Front-End (drawing, JQuery & Javascript)
- <b>Kah Soon Yap</b> : WebSockets (commmunication)
- <b>Javis Wu</b> : WebSockets (communication)

# Description
- A remake of OMGPOP's classic hit , Draw My Thing!, Illustrate My Thang attempts to recreate the beloved old game using concepts and a toolset explored in post AP elective, Stuyvesant's Software Development course. When five players connect to the server, the game begins. The first drawer is the second player to have connected - he is given 60 seconds to draw his given word. The other players have 60 seconds to guess the drawer's given word -> if they can guess it, they are awarded points. If nobody is able to guess the word in 60 seconds, the round is over and nobody receives points. Whoever has the most points at the end of the game will be the winner.

# How It Works
- <b>WebSockets</b> used for Networking
- Hosted on a <b>DigitalOcean</b> server
- <b>Javascript/JQuery</b> for an interactive UI experience
- <b>Bootstrap</b> to enhance the styling of the webpage
- <b>Python/Javascript<b> files in the backend

# Youtube Link
- A 90 second video introducing our project can be found here (https://www.youtube.com/watch?v=t55bjHa1j7U).
- Credits: Ho Yin Ho (voiceover), Tiffany Xiao (video editing)

# Server
- The (Alpha) Version 1.0 of the project is hosted on a DigitalOcean server, and is registered under the FreeDNS chickenkiller.com..
- Users can experience playing through the game at http://illustratemythang.chickenkiller.com:5000, or http://104.131.91.167:5000.

# To Run Locally
- Make a virtualenv in which flask-socketio, gevent, and gevent-websocket are all installed
- Clone the repository
- Change line 51 of illustrateMyThang.js
   - <code> var ws  = io.connect("illustratemythang.chickenkiller.com:5000"); </code> to 
   - <code> var ws = io.connect("localhost:5000"); </code>
- Source activate your virtualenv, and then python server.py in the main directory
- To test, open up several tabs and connect to localhost:5000
- Enjoy :)

# To Do List 
- (features to be implemented in later versions)
- User Accounts (with logins, number of wins, etc.)
- Support for Multiple Rooms (able to join whichever room you please)
- Changing the Mouse Pointer (depending on drawing tool)
- Automatically Scrolling Down (upon sent messages)
- Alerts (one type for server messages, another for chat messages)
- Mobile Support (?)

# Known Bug List
- Refreshing the webpage counts as different connections (refreshing one page 5x will start the game)

# References
- A Simple WebSocket Server
  - https://github.com/dpallot/simple-websocket-server
- Canvas
  - http://tutorials.jenkov.com/html5-canvas/todataurl.html
- Flask-SocketIO
  - https://flask-socketio.readthedocs.org/en/latest
- DesignBootstrap's Chat Box Template
  - http://www.designbootstrap.com/bootstrap-chat-box-template-example/
