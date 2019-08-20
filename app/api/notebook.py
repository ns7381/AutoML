# coding: utf-8
import json

import requests
from flask import request

from app import route, app
from app.api import AuthResource

headers = {
    'Authorization': 'token %s' % app.config.get('JUPYTERHUB_TOKEN'),
    'content-type': 'application/json'
}
api_url = app.config.get('JUPYTERHUB_URL')


class NotebookResource(AuthResource):
    def get(self, id):
        pass

    def delete(self, id):
        user_id = request.cookies.get("user_id")
        requests.delete(api_url + '/user/' + user_id + '/api/contents/' + id, headers=headers)

    def put(self, id):
        pass


route.add_resource(NotebookResource, '/notebooks/<id>')


class NotebookListResource(AuthResource):
    def get(self):
        user_id = request.cookies.get("user_id")
        r = requests.get(api_url + '/user/' + user_id + '/api/contents', headers=headers)
        r.raise_for_status()
        return r.json()

    def post(self):
        user_id = request.cookies.get("user_id")
        r_json = request.get_json()
        r = requests.put(api_url + '/user/' + user_id + '/api/contents/' + r_json['path'], data=json.dumps(r_json),
                         headers=headers)
        r.raise_for_status()
        return r.json()


route.add_resource(NotebookListResource, '/notebooks')
