# Illustrate My Thang (Alpha Version 1.0)

# Development Team Members
- each member was mainly responsible for his parts of the project, but did contribute to other parts as well that may not be fully tracked by commits (working on the same computers, etc.)
- Johnny So : Styling, Middleware, Coordinating the Group (code structure, layout, method)
- Ho Yin Ho : Front-End (drawing, JQuery & Javascript)
- Kah Soon Yap : WebSockets (commmunication)
- Javis Wu : WebSockets (communication)

# Description
- A remake of OMGPOP's classic hit , Draw My Thing!, Illustrate My Thang attempts to recreate the beloved old game using concepts and a toolset explored in post AP elective, Stuyvesant's Software Development course. When five players connect to the server, the game begins. The first drawer is the second player to have connected - he is given 60 seconds to draw his given word. The other players have 60 seconds to guess the drawer's given word -> if they can guess it, they are awarded points. If nobody is able to guess the word in 60 seconds, the round is over and nobody receives points. Whoever has the most points at the end of the game will be the winner.

# How It Works
- WebSockets used for Networking
- Hosted on a DigitalOcean server
- Javascript/JQuery for an interactive UI experience
- Bootstrap to enhance the styling of the webpage
- Python/Javascript files in the backend

# Youtube Link
- A 90 second video introducing our project can be found here (https://www.youtube.com/watch?v=t55bjHa1j7U).
- Credits: Ho Yin Ho (voiceover), Tiffany Xiao (video editing)

# Server
- The (Alpha) Version 1.0 of the project is hosted on a DigitalOcean server, and is registered under the FreeDNS chickenkiller.com..
- Users can experience playing through the game at illustratemythang.chickenkiller.com:5000, or 104.131.91.167:5000.

# To Do List (Features to be implemented in later versions)
- User Accounts (with logins, number of wins, etc.)
- Support for Multiple Rooms (able to join whichever room you please)
- Changing the Mouse Pointer (depending on drawing tool)
- Automatically Scrolling Down (upon sent messages)
- Alerts (one type for server messages, another for chat messages)
- Mobile Support (?)

# References
- A Simple WebSocket Server
  - https://github.com/dpallot/simple-websocket-server
- Canvas
  - http://tutorials.jenkov.com/html5-canvas/todataurl.html
- Flask-SocketIO
  - https://flask-socketio.readthedocs.org/en/latest
- DesignBootstrap's Chat Box Template
  - http://www.designbootstrap.com/bootstrap-chat-box-template-example/
