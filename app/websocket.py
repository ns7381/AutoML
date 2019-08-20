# -*- coding: utf-8 -*-
import json
from collections import defaultdict

from flask import request
from geventwebsocket import WebSocketError


class WebSocket(object):
    def __init__(self, app=None):
        self.app = app
        self.users = defaultdict(list)
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        url = app.config.get('WEBSOCKET_URL', '/websocket')

        @app.route(url)
        def ws():
            socket = request.environ.get('wsgi.websocket')
            routing_key = request.args.to_dict().get('routing-key')
            if not socket:
                print("Expected WebSocket request")
            if socket and routing_key:
                self.users[routing_key].append(socket)
                while True:
                    try:
                        print("socket receive: ", socket.receive())
                    except WebSocketError as e:
                        print("socket error: "+ str(e))
                        return "soecket error"

    def send_msg(self, routing_key, message):
        users = self.users.get(routing_key)
        if users is None:
            return
        for user in users:
            if not user.closed:
                user.send(json.dumps(message))
            else:
                self.users[routing_key].remove(user)
