# coding: utf-8
import json

from flask import request
from flask_restful import reqparse

from app import route, app
from app.api import AuthResource
from app.models import AuditLog, audit_logs_schema, audit_log_schema


@app.after_request
def log_response(response):
    if request.method in ["POST", "PUT", "DELETE"]:
        args = {
            "user_id": request.cookies.get("user_id") or "UNKNOW",
            "login_name": request.cookies.get("user_name") or "UNKNOW",
            "result": response.status,
            "remote_ip": request.headers.get('X-Real-Ip', request.remote_addr),
            "remote_addr": request.remote_addr,
            "server_ip": request.remote_addr,
            "server_name": request.environ['SERVER_NAME'],
            "request_url": request.url,
            "request_method": request.method,
            "request_body": json.dumps(request.get_json()) if request.get_json() is not None else "",
        }
        AuditLog(args).create()
    return response


class AuditLogResource(AuthResource):
    def get(self, id):
        return audit_log_schema.dump(AuditLog.query.get(id))

    def delete(self, id):
        db = AuditLog.query.filter_by(id=id).one()
        db.delete()

    def put(self, id):
        pass


route.add_resource(AuditLogResource, '/audit_logs/<id>')


class AuditLogListResource(AuthResource):
    def get(self):
        pass

    def post(self):
        pass


route.add_resource(AuditLogListResource, '/audit_logs')


class AuditLogPageResource(AuthResource):
    def get(self, page_index, page_size):
        args = reqparse.RequestParser() \
            .add_argument('request_method', type=str, location='args') \
            .add_argument('user_id', type=str, location='cookies') \
            .parse_args()
        params = dict((k, v) for k, v in args.iteritems() if (v is not None and v != ''))
        audit_page = AuditLog.query.filter_by(**params).order_by(AuditLog.create_time.desc()) \
            .paginate(page_index, per_page=page_size, error_out=False)
        results = audit_logs_schema.dump(audit_page.items).data
        return {"result": results, "totalCount": audit_page.total}, 200


route.add_resource(AuditLogPageResource, '/audit_logs/page/<int:page_index>/<int:page_size>')
