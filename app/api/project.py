# coding: utf-8
import json

from flask import request
from flask_restful import reqparse
from pyspark.sql import SparkSession

from app import route, db, app
from app.api import AuthResource
from app.models import Project, projects_schema, project_schema, ProjectEdge, project_nodes_schema, \
    ProjectNode, ProcessStatus


def get_project_session(project_id):
    project = Project.query.filter_by(id=project_id).one()
    return SparkSession.builder \
        .master(app.config.get("SPARK_MASTER")) \
        .config("spark.executor.memory", str(project.memory)+"M") \
        .config("spark.executor.cores", project.cores) \
        .config("spark.driver.allowMultipleContexts", True) \
        .appName(app.config.get("SPARK_APP_NAME")) \
        .getOrCreate()


class ProjectResource(AuthResource):
    def get(self, id):
        edge = ProjectEdge.query.filter_by(project_id=id).first()
        nodes = ProjectNode.query.filter_by(project_id=id)
        project = Project.query.get(id)
        return {
                   'project': project_schema.dump(project).data,
                   'nodes': project_nodes_schema.dump(nodes).data,
                   'connections': json.loads(edge.connections) if edge else []
               }, 200

    def delete(self, id):
        db = Project.query.filter_by(id=id).one()
        ProjectEdge.query.filter_by(project_id=id).delete()
        [node.delete() for node in ProjectNode.query.filter_by(project_id=id)]
        db.delete()

    def put(self, id):
        pass


route.add_resource(ProjectResource, '/projects/<id>')


class ProjectListResource(AuthResource):
    def get(self):
        pass

    def post(self):
        args = reqparse.RequestParser() \
            .add_argument('name', type=str, location='json') \
            .add_argument('memory', type=int, location='json') \
            .add_argument('cores', type=int, location='json') \
            .add_argument('user_id', type=str, location='cookies') \
            .parse_args()
        project = Project(args)
        return project_schema.dump(project.create())


route.add_resource(ProjectListResource, '/projects')


class ProjectPageResource(AuthResource):
    def get(self, page_index, page_size):
        args = reqparse.RequestParser() \
            .add_argument('name', type=str, location='args') \
            .add_argument('user_id', type=str, location='cookies') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if (v is not None and v != ''))
        project_page = Project.query.filter_by(**params).order_by(Project.create_time.desc()) \
            .paginate(page_index, per_page=page_size, error_out=False)
        results = projects_schema.dump(project_page.items).data
        return {"result": results, "totalCount": project_page.total}, 200


route.add_resource(ProjectPageResource, '/projects/page/<int:page_index>/<int:page_size>')


class ProjectSaveResource(AuthResource):
    def post(self, id):
        json_data = request.get_json(force=True)
        save_flow(json_data['nodes'], json_data['connections'], id)
        return 'SUCCESS', 200


route.add_resource(ProjectSaveResource, '/projects/<id>/save')


class ProjectStartResource(AuthResource):
    def post(self, id):
        json_data = request.get_json(force=True)
        node_json = json_data['nodes']
        connections_json = json_data['connections']
        project_nodes = save_flow(node_json, connections_json, id)
        from app.flow.engine import ProcessEngine
        ProcessEngine(Project.query.get(id), project_nodes, connections_json).start()
        return "SUCCESS"


route.add_resource(ProjectStartResource, '/projects/<id>/start')


def save_flow(nodes, connections, id):
    project_nodes = []
    edge = ProjectEdge.query.filter_by(project_id=id).first()
    if edge:
        edge.connections = json.dumps(connections)
        edge.update()
    else:
        ProjectEdge({'connections': connections, 'project_id': id}).create()

    def create_node(project_node, project_id):
        project_node['project_id'] = project_id
        project_node['status'] = ProcessStatus.DEFAULT
        project_node['result'] = ''
        project_node['log'] = ''
        return ProjectNode(project_node)

    update_node_ids = []
    for db_node in ProjectNode.query.filter_by(project_id=id).all():
        is_exist = False
        for node in nodes:
            if node['id'] == db_node.id:
                project_nodes.append(db_node.copy_properties(create_node(node, id)).update())
                is_exist = True
                update_node_ids.append(node['id'])
                break
        if not is_exist:
            db_node.delete()

    project_nodes.extend([create_node(node, id).create() for node in nodes if node['id'] not in update_node_ids])
    project = Project.query.get(id)
    project.status = ProcessStatus.DEFAULT
    project.update()
    return project_nodes
