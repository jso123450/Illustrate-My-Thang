from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('canvas.html')

@socketio.on('clientMessage')
def recievedMessage(message):
    emit('serverMessage', message, broadcast=True)

if __name__  ==  '__main__':
    app.debug = True
    socketio.run(app)
    app.secret_key="stuff"
    
