from flask import Flask, render_template 
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)
words=["cats","dogs"]
word=""
freeIDs=[0,1,2,3,4]
usedIDs=[]
drawer=[4,0,1,2,3]

@app.route('/', methods=["GET","POST"])
def index():
    return render_template('index.html')
'''
@socketio.on('connect')
def connection():
    emit('joined')

@socketio.on('disconnect')
def disconnect():
    emit('disconnected')
'''
@socketio.on('joined')
def newPerson():
    if len(usedIDs)==5:
        emit('tooMany')
    else:
        idNumber=freeIDs[0]
        freeIDs.remove(freeIDs[0])
        usedIDs.append(idNumber)
        emit('drawerID', idNumber)

@socketio.on('disconnected')
def disconnected(userID):
    usedIDs.remove(userID)
    freeIDs.append(userID)

@socketio.on('clientMessage')
def recievedMessage(data):
    if (word in data["msg"]):
        
    emit('serverMessage', data, broadcast=True)

@socketio.on("roundSetup")
def roundSetup():
    if len(usedIDs)==3:#change back to 5 later
        changeDrawer()
        changeWord()
        emit("roundSetup2", [drawer[0], words[0]], broadcast=True)

def changeDrawer():
    drawerID=drawer[0]
    drawer.remove(drawerID)
    drawer.append(drawerID)

def changeWord():
    word=words[0]
    words.remove(word)
    words.append(word)

@socketio.on("roundStart")
def roundStart():
    emit('roundStart2', broadcast = True)

@socketio.on("roundEnd")
def roundEnd():
    emit("transition",broadcast = True)

@socketio.on("coordinates")
def coordinates(data):
    x=data["x"]
    y=data["y"]
    color = data["color"]
    width = data["width"]
    isDrawing = data["isDrawing"]
    emit("drawing", [x, y, color, width, isDrawing], broadcast = True)
    
if __name__  ==  '__main__':
    app.debug = True
    socketio.run(app, host="0.0.0.0", port=5000)
    app.secret_key="stuff"
    
