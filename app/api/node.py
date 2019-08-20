# coding: utf-8
from flask_restful import Resource, reqparse

from app import route
from app.models import Node, nodes_schema, NodeParam, \
    node_params_schema


class NodeListResource(Resource):
    def get(self):
        args = reqparse.RequestParser() \
            .add_argument('parent_id', type=str, location='args') \
            .parse_args()
        nodes = Node.query.filter_by(parent_id=args['parent_id'], is_hide=False).order_by(Node.order_num.asc())
        return nodes_schema.dump(nodes)


route.add_resource(NodeListResource, '/nodes')


class NodeParamListResource(Resource):
    def get(self, id):
        nodes = NodeParam.query.filter_by(node_id=id).order_by(NodeParam.order_num.asc())
        return node_params_schema.dump(nodes)


route.add_resource(NodeParamListResource, '/nodes/<id>/params')
