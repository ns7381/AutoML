import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_marshmallow import Marshmallow
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from app.websocket import WebSocket

app = Flask(__name__, static_url_path='', static_folder="../static")
app.config.from_object("config.Config")
db = SQLAlchemy(app)

route = Api(app, prefix='/api/v1', default_mediatype="application/json")
ma = Marshmallow(app)
ws = WebSocket(app)

log_dir = os.path.split(app.config['LOGGING_LOCATION'])[0]
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
handler = RotatingFileHandler(app.config['LOGGING_LOCATION'], maxBytes=1024 * 1024, backupCount=5)
formatter = logging.Formatter(app.config['LOGGING_FORMAT'])
handler.setFormatter(formatter)
handler.setLevel(app.config['LOGGING_LEVEL'])
app.logger.addHandler(handler)

from app import views, api
