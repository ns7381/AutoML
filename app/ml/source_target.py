# coding: utf-8
import importlib
import json
import os

from app import app
from app.models import Model, ModelStatus
from . import CustomResolver


class SourceRead(CustomResolver):
    def __init__(self, format=None, options=None, file_path=''):
        self.format = format
        self.options = options
        self.file_path = file_path

    def resolve(self, spark):
        return spark.read.format(self.format).options(**json.loads(self.options)).load(self.file_path)


class FileRead(CustomResolver):
    def __init__(self, file_path='', format='csv', delimiter=',', header=True):
        self.format = format
        self.delimiter = delimiter
        self.file_path = file_path
        self.header = header

    def resolve(self, spark):
        return spark.read.format(self.format).option("delimiter", self.delimiter).option("header", self.header).option(
            "inferSchema", True).load(self.file_path)


class FileWrite(CustomResolver):
    def __init__(self, format='csv', delimiter=',', file_path='', columns=None):
        self.format = format
        self.delimiter = delimiter
        self.file_path = os.path.join(app.config.get("SOURCE_PATH", ''), file_path)
        self.columns = columns

    def resolve(self, df):
        df.select(self.columns).write.format(self.format).options(**{'delimiter': self.delimiter}).save(
            self.file_path)
        return df


class JDBCRead(CustomResolver):
    def __init__(self, db_host, db_port, db_database, dbtable, user, password=''):
        self.db_host = db_host
        self.db_port = db_port
        self.db_database = db_database
        self.dbtable = dbtable
        self.user = user
        self.password = password

    def resolve(self, spark):
        return spark.read \
            .format("jdbc") \
            .option("url", "jdbc:mysql" + "://" + self.db_host + ":" + self.db_port + "/" + self.db_database) \
            .option("dbtable", self.dbtable) \
            .option("user", self.user) \
            .option("password", self.password) \
            .load()


class JDBCWrite(CustomResolver):
    def __init__(self, db_host, db_port, db_database, dbtable, user, password=''):
        self.db_host = db_host
        self.db_port = db_port
        self.db_database = db_database
        self.dbtable = dbtable
        self.user = user
        self.password = password

    def resolve(self, df):
        df.write \
            .format("jdbc") \
            .option("url", "jdbc:mysql" + "://" + self.db_host + ":" + self.db_port + "/" + self.db_database) \
            .option("dbtable", self.dbtable) \
            .option("user", self.user) \
            .option("password", self.password) \
            .save()
        return df


class ModelSave(CustomResolver):
    def __init__(self, name, file_path='', user_id='', project_id=''):
        self.name = name
        self.file_path = os.path.join(app.config.get("MODEL_PATH", ''), file_path)
        self.user_id = user_id
        self.project_id = project_id

    def resolve(self, model):
        model.save(self.file_path)
        Model({'name': self.name, 'model_path': self.file_path, 'status': ModelStatus.ENABLE,
               'user_id': self.user_id, 'module': model.__module__, 'method': model.__class__.__name__,
               'project_id': self.project_id}).create()
        return model


class ModelLoader(CustomResolver):
    def __init__(self, module, method, model_path):
        self.module = module
        self.model_path = model_path
        self.method = method

    def resolve(self, df):
        model_class = getattr(importlib.import_module(self.module), self.method)()
        return model_class.load(self.model_path).transform(df)
