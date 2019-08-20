# coding: utf-8
import importlib
import json
import shutil
from datetime import datetime

from flask import send_file
from flask_restful import reqparse, Resource

from app import route
from app.api import AuthResource
from app.api.project import get_project_session
from app.models import Model, models_schema, ModelStatus, Project


class ModelResource(AuthResource):
    def get(self, id):
        pass

    def delete(self, id):
        db = Model.query.filter_by(id=id).one()
        shutil.rmtree(db.model_path)
        db.delete()

    def put(self, id):
        args = reqparse.RequestParser() \
            .add_argument('status', type=ModelStatus, location='json') \
            .parse_args()
        model_db = Model.query.filter_by(id=id).one()
        model_db.status = args['status']
        model_db.publish_time = datetime.now()
        model_db.update()


route.add_resource(ModelResource, '/models/<id>')


class ModelListResource(AuthResource):
    def get(self):
        args = reqparse.RequestParser() \
            .add_argument('user_id', type=str, location='cookies') \
            .add_argument('status', type=ModelStatus, location='args') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if v is not None)
        sources = Model.query.filter_by(**params).order_by(Model.create_time.desc())
        results = models_schema.dump(sources).data
        return results

    def post(self):
        pass


route.add_resource(ModelListResource, '/models')


class ModelPageResource(AuthResource):
    def get(self, page_index, page_size):
        args = reqparse.RequestParser() \
            .add_argument('name', type=str, location='args') \
            .add_argument('status', type=ModelStatus, location='args') \
            .add_argument('user_id', type=str, location='cookies') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if (v is not None and v != ''))
        model_page = Model.query.filter_by(**params).order_by(Model.create_time.desc()) \
            .paginate(page_index, per_page=page_size, error_out=False)
        results = models_schema.dump(model_page.items).data
        for model in results:
            model['project_name'] = Project.query.get(model['project_id']).name
        return {"result": results, "totalCount": model_page.total}, 200


route.add_resource(ModelPageResource, '/models/page/<int:page_index>/<int:page_size>')


class ModelDownloadResource(Resource):
    def get(self, id):
        model = Model.query.get(id)
        if not model.model_path:
            raise Exception('Model path is empty.')
        import shutil
        filename = shutil.make_archive("/tmp/models/" + model.name, 'zip', model.model_path)
        return send_file(filename, as_attachment=True)


route.add_resource(ModelDownloadResource, '/models/<id>/download')


class ModelRealtimePredict(Resource):
    def post(self, id):
        args = reqparse.RequestParser() \
            .add_argument('predict_x', type=dict, location='json') \
            .parse_args()
        model = Model.query.get(id)
        if not model.model_path:
            raise Exception('Model path is empty.')
        project = Project.query.get(id=model['project_id'])
        spark = get_project_session(project.id)
        sc = spark.sparkContext
        predict_data = json.dumps(args["predict_x"])
        predict_df = spark.read.json(sc.parallelize([predict_data]))
        model_class = getattr(importlib.import_module(model.module), model.method)()
        predict_result_df = model_class.load(model.model_path).transform(predict_df)
        return str(predict_result_df.select(['prediction']).toPandas().values[0][0])


route.add_resource(ModelRealtimePredict, '/models/<id>/predict')
