# coding: utf-8
from flask_restful import Resource, reqparse
from flask_security import login_user
from flask_security.utils import hash_password

from app import route, app
from app.api import AuthResource
from app.models import User, users_schema, user_datastore, Model, Source, Project


class LoginResource(Resource):
    def post(self):
        args = reqparse.RequestParser() \
            .add_argument('name', type=str, location='json', required=True, help="用户名不能为空") \
            .add_argument("password", type=str, location='json', required=True, help="密码不能为空") \
            .parse_args()
        security_mode = app.config.get("APP_SECURITY_MODE", "flask")
        if security_mode == 'flask':
            return self.flask_login(args['name'], args['password'])
        elif security_mode == 'keycloak':
            return self.keycloak_login(args['name'], args['password'])

    def flask_login(self, username, password):
        user = User.authenticate(username, password)
        if user and user.active:
            if not login_user(user=user):
                return {"message": "用户无法登陆"}, 401
            return {"id": user.id, "name": user.username, "roles": [role.name for role in user.roles],
                    "ml_token_id": user.get_auth_token()}, 200
        elif not user.active:
            return {"message": "用户已被禁用"}, 401
        else:
            return {"message": "用户名或密码错误"}, 401

    def keycloak_login(self, username, password):
        user, token = User.authenticate(username, password)
        if not login_user(user=user):
            return {"message": "用户无法登陆"}, 401
        token = token['access_token']
        return {"id": user['preferred_username'], "name": user['preferred_username'], "roles": ['admin'],
                "ml_token_id": token}, 200


route.add_resource(LoginResource, '/auth')


class UserResource(AuthResource):
    def get(self, id):
        pass

    def delete(self, id):
        db = user_datastore.get_user(id)
        user_datastore.delete_user(db)

    def put(self, id):
        # Token validation still pass when change password, Because I remove
        # flask-security core.py _request_loader function's one statement in 237 line:
        # if user and verify_hash(data[1], user.password):
        args = reqparse.RequestParser() \
            .add_argument('active', type=bool, location='json') \
            .add_argument('password', type=str, location='json') \
            .add_argument('old_password', type=str, location='json') \
            .parse_args()
        user = user_datastore.get_user(id)
        if args['active'] is not None and args['active'] != "":
            user.active = args['active']
        if args['password'] is not None and args['password'] != "":
            user.authenticate(user.username, args['old_password'])
            user.password = hash_password(args['password'])
        user_datastore.put(user)


route.add_resource(UserResource, '/users/<id>')


class UserListResource(AuthResource):
    def get(self):
        pass

    def post(self):
        # parse argument and convert to model dict
        args = reqparse.RequestParser() \
            .add_argument('user_name', type=str, location='json') \
            .add_argument('user_password', type=str, location='json') \
            .parse_args()
        User(args['user_name'], args['user_password']).create()
        return "SUCCESS"


route.add_resource(UserListResource, '/users')


class UserPageResource(AuthResource):
    def get(self, page_index, page_size):
        args = reqparse.RequestParser() \
            .add_argument('name', type=str, location='args') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if (v is not None and v != ''))
        user_page = User.query.filter_by(**params).order_by(User.create_time.desc()) \
            .paginate(page_index, per_page=page_size, error_out=False)
        results = users_schema.dump(user_page.items).data
        for user in results:
            user['project_num'] = Project.query.filter_by(user_id=user['id']).count()
            user['source_num'] = Source.query.filter_by(user_id=user['id']).count()
            user['model_num'] = Model.query.filter_by(user_id=user['id']).count()
            user.pop('password')

        return {"result": results, "totalCount": user_page.total}, 200


route.add_resource(UserPageResource, '/users/page/<int:page_index>/<int:page_size>')
