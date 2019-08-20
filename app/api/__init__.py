# coding: utf-8
from functools import wraps

from flask import Response, request
from flask_restful import Resource

from app import app

APP_SECURITY_MODE = app.config.get("APP_SECURITY_MODE", "flask")
AUTH_METHOD = None
if APP_SECURITY_MODE == 'keycloak':
    _default_unauthorized_html = """
        <h1>Unauthorized</h1>
        <p>The server could not verify that you are authorized to access the URL
        requested. You either supplied the wrong credentials (e.g. a bad password),
        or your browser doesn't understand how to supply the credentials required.
        </p>
        """


    def auth_token_required(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            if _check_token():
                return fn(*args, **kwargs)
            else:
                return _get_unauthorized_response()

        return decorated


    def _get_unauthorized_response(text=None, headers=None):
        text = text or _default_unauthorized_html
        headers = headers or {}
        return Response(text, 401, headers)


    def _check_token():
        token = request.headers.get('AUTHORIZATION')
        from keycloak import KeycloakOpenID
        keycloak_openid = KeycloakOpenID(server_url=app.config.get("SERVER_URL"),
                                         client_id=app.config.get("CLIENT_ID"),
                                         realm_name=app.config.get("REALM_NAME"),
                                         client_secret_key=app.config.get("CLIENT_SECRET_KEY"))
        token_info = keycloak_openid.introspect(token)
        return True


    AUTH_METHOD = auth_token_required

elif APP_SECURITY_MODE == 'flask':
    from flask_security import auth_token_required

    AUTH_METHOD = auth_token_required


class AuthResource(Resource):
    method_decorators = [AUTH_METHOD]


import source, user, project, model, notebook, audit, system, node
