# coding: utf-8
from flask_restful import Resource

from app import route


class SystemStatusResource(Resource):
    def get(self):
        pass


route.add_resource(SystemStatusResource, '/system/status')
