from flask import Flask, render_template 
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)
words=["cat","dog","whale","flower","love","donut","horse","bird","clock",
"leaf","tree","computer","phone","french fries","skirt","Statue of Liberty",
"flag","USA","Earth","sphere","desk","book","magazine","watch","newspaper","doll","jacket","folder","chair","closet"]
word= "abcdefghijklmnopqrstuvwxyz"
freeIDs=[0,1,2,3,4]
usedIDs=[]
drawer=[]
names=[]
points=[0, 0, 0, 0, 0]
gameStarted=False

@app.route('/', methods=["GET","POST"])
def index():
    return render_template('index.html')

@socketio.on('joined')
def newPerson(person):
    if len(usedIDs)==5:
        emit('tooMany')
    elif gameStarted:
        emit('gameStarted')
    else:
        names.append(person)
        idNumber=freeIDs[0]
        freeIDs.remove(freeIDs[0])
        usedIDs.append(idNumber)
        drawer.append(idNumber)
        emit('chatAlert', person, broadcast=True)
        emit('peopleOnline', [names, points, usedIDs], broadcast=True)
        emit('drawerID', idNumber)

@socketio.on('disconnected')
def disconnected(userInfo):
    temp=names.index(userInfo[1])
    usedIDs.remove(userInfo[0])
    freeIDs.append(userInfo[0])
    drawer.remove(userInfo[0])
    names.remove(userInfo[1])
    points[temp]=0
    if len(usedIDs)<2:
        global gameStarted
        gameStarted=False
    emit('chatAlertDC', userInfo[1], broadcast=True)
    emit('peopleOnline', [names, points, usedIDs], broadcast=True)

@socketio.on('clientMessage')
def recievedMessage(data):
    print (word in data["msg"])
    print (word)
    if (word in data["msg"]):
        if not(data["dID"]):
            data["winner"]=True
            points[data["uID"]]=points[data["uID"]]+1
        emit('serverMessage', data, broadcast=True)
        emit('peopleOnline', [names, points, usedIDs], broadcast=True)
    else:
        emit('serverMessage', data, broadcast=True)
        
@socketio.on("roundSetup")
def roundSetup():
    if len(usedIDs)==5:
        changeDrawer()
        changeWord()
        global gameStarted
        gameStarted=True
        emit("roundSetup2", [drawer[0], words[0]], broadcast=True)
    elif gameStarted:
        changeDrawer()
        changeWord()
        emit("roundSetup2", [drawer[0], words[0]], broadcast=True)
        
def changeDrawer():
    drawerID=drawer[0]
    drawer.remove(drawerID)
    drawer.append(drawerID)

def changeWord():
    temp=words[0]
    words.remove(temp)
    words.append(temp)
    global word
    word=words[0]

@socketio.on("roundStart")
def roundStart():
    emit('roundStart2', broadcast = True)

@socketio.on("roundBuffer")
def roundEnd():
    emit("roundBuffer2", broadcast = True)

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
    
