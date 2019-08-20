# coding: utf-8
import json

from flask_restful import reqparse

import project
from app import route
from . import AuthResource
from app.models import Source, sources_schema, source_schema


class SourceResource(AuthResource):
    def get(self, id):
        pass

    def delete(self, id):
        db = Source.query.filter_by(id=id)
        db.delete()

    def put(self, id):
        pass


route.add_resource(SourceResource, '/sources/<id>')


class SourceListResource(AuthResource):
    def get(self):
        args = reqparse.RequestParser() \
            .add_argument('user_id', type=str, location='cookies') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if v is not None)
        sources = Source.query.filter_by(**params).order_by(Source.create_time.desc())
        results = sources_schema.dump(sources).data
        return results

    def post(self):
        source_dict = reqparse.RequestParser() \
            .add_argument('name', required=True, type=str, location='json') \
            .add_argument('file_path', required=True, type=str, location='json') \
            .add_argument('options', required=True, type=str, location='json') \
            .add_argument('format', required=True, type=str, location='json') \
            .add_argument('user_id', required=True, type=str, location='cookies') \
            .parse_args()
        source = Source(source_dict)
        source.create()
        return source_schema.dump(source)


route.add_resource(SourceListResource, '/sources')


class SourcePageResource(AuthResource):
    def get(self, page_index, page_size):
        args = reqparse.RequestParser() \
            .add_argument('name', type=str, location='args') \
            .add_argument('user_id', type=str, location='cookies') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if (v is not None and v != ''))
        source_page = Source.query.filter_by(**params).order_by(Source.create_time.desc()) \
            .paginate(page_index, per_page=page_size, error_out=False)

        return {"result": sources_schema.dump(source_page.items).data, "totalCount": source_page.total}, 200


route.add_resource(SourcePageResource, '/sources/page/<int:page_index>/<int:page_size>')


class LoadSourceResource(AuthResource):
    def get(self, id):
        args = reqparse.RequestParser() \
            .add_argument('project_id', required=True, type=str, location='args') \
            .parse_args()
        source = Source.query.get(id)
        spark = project.get_project_session(args['project_id'])
        df = spark.read.format(source.format).options(**source.get_options()).load(source.file_path).cache()
        schema_json = json.loads(df.schema.json())
        fields = []
        for field in schema_json['fields']:
            if isinstance(field['type'], dict):
                fields.append({'name': field['name'], 'type': field['type']['type']})
            else:
                fields.append({'name': field['name'], 'type': field['type']})
        return fields


route.add_resource(LoadSourceResource, '/sources/<id>/fields')


class LoadColumnResource(AuthResource):
    def post(self):
        args = reqparse.RequestParser() \
            .add_argument('project_id', required=True, type=str, location='args') \
            .add_argument('file_path', type=str, location='json') \
            .add_argument('options', required=True, type=dict, location='json') \
            .add_argument('format', required=True, type=str, location='json') \
            .add_argument('user_id', required=True, type=str, location='cookies') \
            .parse_args()
        file_path = ''
        if 'file_path' in args:
            file_path = args['file_path']
        spark = project.get_project_session(args['project_id'])
        df = spark.read.format(args['format']).options(**args['options']).load(file_path).cache()
        schema_json = json.loads(df.schema.json())
        fields = []
        for field in schema_json['fields']:
            if isinstance(field['type'], dict):
                fields.append({'name': field['name'], 'type': field['type']['type']})
            else:
                fields.append({'name': field['name'], 'type': field['type']})
        return fields


route.add_resource(LoadColumnResource, '/sources/fields')
