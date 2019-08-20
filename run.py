from geventwebsocket import WebSocketServer

from app import app

if __name__ == '__main__':
    server = WebSocketServer(('0.0.0.0', 5000), app)
    server.serve_forever()
