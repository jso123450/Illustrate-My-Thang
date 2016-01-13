from flask import Flask, render_template 
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)
people=[]
words=["cats","dogs"]
freeIDs=[0,1,2,3,4]
usedIDs=[]
drawer=0

@app.route('/', methods=["GET","POST"])
def index():
    return render_template('chat.html')
'''
@socketio.on('connect')
def connection():
    emit('joined')

@socketio.on('disconnect')
def disconnect():
    emit('disconnected')
'''
@socketio.on('joined')
def newPerson(person):
    if len(people)==5:
        emit('tooMany')
    else:
        people.append(person)
        idNumber=freeIDs[0]
        freeIDs.remove(freeIDs[0])
        usedIDs.append(idNumber)
        emit('drawerID', idNumber)

@socketio.on('clientMessage')
def recievedMessage(message):
    emit('serverMessage', message, broadcast=True)

@socketio.on('drawingMessage')
def recievedImage(xcor,ycor):
    emit('serverDrawing',xcor,ycor, broadcast=True)

@socketio.on("gameStart")
def gameStart():
   '''round = 1
   1 or 2
   once it hits 3 game is over'''
   

@socketio.on("roundStart")
    

if __name__  ==  '__main__':
    app.debug = True
    socketio.run(app, host="0.0.0.0", port=5000)
    app.secret_key="stuff"
    
