# coding: utf-8
import json
import uuid
from datetime import datetime

import enum
from flask_security import SQLAlchemyUserDatastore, Security
from flask_security import UserMixin, RoleMixin
from flask_security.utils import verify_password, hash_password

from app import app, db, ma


def generate_uuid():
    return str(uuid.uuid4()).replace('-', '')


class CRUD():
    def create(self):
        self.create_time = datetime.now()
        db.session.add(self)
        db.session.commit()
        return self

    def update(self):
        db.session.commit()
        return self

    def delete(self):
        db.session.delete(self)
        return db.session.commit()


roles_users = db.Table('roles_users',  # 用户权限中间表
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))


class Role(db.Model, RoleMixin):
    __tablename__ = "role"
    __table_args__ = {"useexisting": True}
    id = db.Column(db.Integer(), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __init__(self, name, description):
        self.name = name
        self.description = description


class User(db.Model, UserMixin, CRUD):
    __tablename__ = "user"
    __table_args__ = {"useexisting": True}
    id = db.Column('id', db.String(36), primary_key=True, default=generate_uuid)
    username = db.Column('user_name', db.String(64), unique=True)
    password = db.Column('password', db.String(64))
    active = db.Column(db.Boolean(), default=True, nullable=False)
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
    create_time = db.Column('create_time', db.DateTime, server_default=db.text('NOW()'))

    def __init__(self, username, password):
        self.username = username
        self.password = hash_password(password)
        self.active = True

    @staticmethod
    def authenticate(username, password):
        AUTH_MODE = app.config.get("APP_SECURITY_MODE", "flask")
        if AUTH_MODE == 'flask':
            user = User.query.filter(User.username == username).one()
            if user and verify_password(password, user.password):
                return user
            else:
                raise Exception("user password is error")
        elif AUTH_MODE == 'keycloak':
            from keycloak import keycloak_openid
            token = keycloak_openid.token(username, password)
            user = keycloak_openid.userinfo(token['access_token'])
            return user, token


# Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security().init_app(app, user_datastore, register_blueprint=False)


class UsersSchema(ma.ModelSchema):
    class Meta:
        model = User


user_schema = UsersSchema()
users_schema = UsersSchema(many=True)


class SceneType(str, enum.Enum):
    classification = "classification"
    regression = "regression"
    recommendation = "recommendation"
    clustering = "clustering"


class Source(db.Model, CRUD):
    __tablename__ = 'source'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(36))
    file_path = db.Column(db.String(255))
    options = db.Column(db.String(255))
    format = db.Column(db.String(11))
    user_id = db.Column(db.String(36))
    create_time = db.Column(db.DateTime, server_default=db.text('NOW()'))

    def __init__(self, dictionary):
        """Constructor"""
        for key in dictionary:
            setattr(self, key, dictionary[key])

    def get_options(self):
        if isinstance(self.options, basestring):
            return json.loads(self.options)
        return self.options


class SourcesSchema(ma.ModelSchema):
    class Meta:
        model = Source


source_schema = SourcesSchema()
sources_schema = SourcesSchema(many=True)


class ModelStatus(str, enum.Enum):
    ENABLE = "ENABLE"
    BUILDING = "BUILDING"
    DISABLE = "DISABLE"
    PUBLISH = "PUBLISH"


class Model(db.Model, CRUD):
    __tablename__ = 'model'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(64), nullable=False)
    module = db.Column(db.String(64), nullable=False)
    method = db.Column(db.String(64), nullable=False)
    model_path = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Enum(ModelStatus))
    user_id = db.Column(db.String(36))
    project_id = db.Column(db.String(36))
    create_time = db.Column(db.DateTime)

    def __init__(self, dictionary):
        """Constructor"""
        for key in dictionary:
            setattr(self, key, dictionary[key])


class ModelsSchema(ma.ModelSchema):
    class Meta:
        model = Model


model_schema = ModelsSchema()
models_schema = ModelsSchema(many=True)


class Node(db.Model, CRUD):
    __tablename__ = 'node'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(36))
    module = db.Column(db.String(36))
    method = db.Column(db.String(36), nullable=False)
    order_num = db.Column(db.Integer, nullable=False)
    is_leaf = db.Column(db.Boolean, nullable=False)
    parent_id = db.Column(db.String(36), nullable=False)
    input = db.Column(db.String(36), nullable=False)
    output = db.Column(db.String(36), nullable=False)
    icon = db.Column(db.String(36), nullable=False)
    is_hide = db.Column(db.Boolean, nullable=False)


class NodesSchema(ma.ModelSchema):
    class Meta:
        model = Node


node_schema = NodesSchema()
nodes_schema = NodesSchema(many=True)


class NodeParam(db.Model, CRUD):
    __tablename__ = 'node_param'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(36))
    label = db.Column(db.String(36))
    description = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(36), nullable=False)
    default_value = db.Column(db.String(36), nullable=False)
    order_num = db.Column(db.Integer, nullable=False)
    node_id = db.Column(db.String(36), nullable=False)
    is_required = db.Column(db.Boolean, nullable=False)
    validation = db.Column(db.String(255), nullable=False)


class NodeParamsSchema(ma.ModelSchema):
    class Meta:
        model = NodeParam


node_param_schema = NodeParamsSchema()
node_params_schema = NodeParamsSchema(many=True)


class ProcessStatus(str, enum.Enum):
    RUNNING = "running"
    SUCCESS = "success"
    ERROR = "error"
    DEFAULT = "default"


class ProjectNode(db.Model, CRUD):
    __tablename__ = 'project_node'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(36))
    module = db.Column(db.String(36))
    method = db.Column(db.String(36), nullable=False)
    order_num = db.Column(db.Integer, nullable=False)
    input = db.Column(db.String(36), nullable=False)
    output = db.Column(db.String(36), nullable=False)
    icon = db.Column(db.String(36), nullable=False)
    columns = db.Column(db.String(10240), nullable=False)
    params = db.Column(db.String(255), nullable=False)
    position_x = db.Column(db.BigInteger, nullable=False)
    position_y = db.Column(db.BigInteger, nullable=False)
    log = db.Column(db.Text, nullable=False)
    result = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(ProcessStatus), nullable=False)
    node_definition_id = db.Column(db.String(36))
    project_id = db.Column(db.String(36))
    arg_list = []
    return_tuple = ()

    def __init__(self, dictionary):
        """Constructor"""
        for key in dictionary:
            _value = dictionary[key]
            setattr(self, key, json.dumps(_value) if isinstance(_value, dict) or isinstance(_value, list) else _value)

    def get_params(self):
        if isinstance(self.params, basestring):
            return json.loads(self.params)
        return self.params

    def copy_properties(self, to_source):
        self.name = to_source.name
        self.module = to_source.module
        self.method = to_source.method
        self.input = to_source.input
        self.output = to_source.output
        self.icon = to_source.icon
        self.columns = to_source.columns
        self.params = to_source.params
        self.position_x = to_source.position_x
        self.position_y = to_source.position_y
        self.result = to_source.result
        self.status = to_source.status
        self.node_definition_id = to_source.node_definition_id
        return self


class ProjectNodesSchema(ma.ModelSchema):
    class Meta:
        model = ProjectNode


project_node_schema = ProjectNodesSchema()
project_nodes_schema = ProjectNodesSchema(many=True)


class ProjectEdge(db.Model, CRUD):
    __tablename__ = 'project_edge'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    project_id = db.Column(db.String(36))
    connections = db.Column(db.Text)

    def __init__(self, dictionary):
        """Constructor"""
        for key in dictionary:
            _value = dictionary[key]
            setattr(self, key, json.dumps(_value) if isinstance(_value, dict) or isinstance(_value, list) else _value)


class ProjectEdgesSchema(ma.ModelSchema):
    class Meta:
        model = ProjectEdge


project_edge_schema = ProjectEdgesSchema()
project_edges_schema = ProjectEdgesSchema(many=True)


class Project(db.Model, CRUD):
    __tablename__ = 'project'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(64), nullable=False)
    memory = db.Column(db.Integer, nullable=False)
    cores = db.Column(db.Integer, nullable=False)
    create_time = db.Column(db.DateTime)
    user_id = db.Column(db.String(36))
    status = db.Column(db.Enum(ProcessStatus), nullable=False)
    description = db.Column(db.String(255))

    def __init__(self, dictionary):
        """Constructor"""
        for key in dictionary:
            setattr(self, key, dictionary[key])


class ProjectsSchema(ma.ModelSchema):
    class Meta:
        model = Project


project_schema = ProjectsSchema()
projects_schema = ProjectsSchema(many=True)


class AuditLog(db.Model, CRUD):
    __tablename__ = 'operation_audit'
    __table_args__ = {"useexisting": True}

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column("uid", db.String(36))
    login_name = db.Column(db.String(50), nullable=False)
    create_time = db.Column("ctime", db.DateTime, nullable=False)
    result = db.Column(db.String(150), nullable=False)
    remote_ip = db.Column(db.String(50), nullable=False)
    remote_addr = db.Column(db.String(50), nullable=False)
    server_ip = db.Column(db.String(50), nullable=False)
    server_name = db.Column(db.String(100), nullable=False)
    request_url = db.Column(db.String(255))
    request_method = db.Column(db.String(10))
    request_body = db.Column(db.String(1024))
    query_string = db.Column(db.String(1024))

    def __init__(self, dictionary):
        """Constructor"""
        for key in dictionary:
            setattr(self, key, dictionary[key])

    def set_options(self, dictionary):
        for key in dictionary:
            setattr(self, key, dictionary[key])


class AuditLogsSchema(ma.ModelSchema):
    class Meta:
        model = AuditLog


audit_log_schema = AuditLogsSchema()
audit_logs_schema = AuditLogsSchema(many=True)