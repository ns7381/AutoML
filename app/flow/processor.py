# coding: utf-8
import importlib
import json
import threading

from pyspark.ml import Model
from pyspark.ml.wrapper import JavaTransformer, JavaEstimator
from pyspark.sql import DataFrame

from app import db, app, ws
from app.ml import CustomResolver
from app.models import ProcessStatus


class Processor(threading.Thread):

    def __init__(self, node, queue):
        super(Processor, self).__init__()
        self.node = node
        self.arg_list = node.arg_list
        self.queue = queue

    def run(self):
        result = None
        self.node = db.session.merge(self.node)
        node = self.node
        self._async_commit_status(ProcessStatus.RUNNING)
        self._send_ws()
        try:
            ml_class = getattr(importlib.import_module(node.module), node.method)(**node.get_params())
            if isinstance(ml_class, JavaTransformer):
                result = ml_class.transform(*self.arg_list)
            elif isinstance(ml_class, JavaEstimator):
                result = ml_class.fit(*self.arg_list)
                if node.module == "pyspark.ml.feature":
                    result = result.transform(*self.arg_list)
            elif isinstance(ml_class, CustomResolver):
                result = ml_class.resolve(*self.arg_list)

            if isinstance(result, DataFrame):
                node.result = json.dumps([[str(d)[:50] for d in list(line)] for line in result.head(20)])
            elif node.module == 'app.ml.evaluation' or node.module == 'app.ml.statistic':
                node.result = json.dumps(result)

            node.status = ProcessStatus.SUCCESS
        except Exception as e:
            app.logger.exception(str(e))
            node.log = str(e)
            node.status = ProcessStatus.ERROR
        finally:
            node.return_tuple = result
            node.update()
            self._send_ws()
            self.queue.put(node)
            db.session.close()

    def _async_commit_status(self, status):
        def update_node(node_db):
            db.session.merge(node_db).update()
            db.session.close()

        self.node.status = status
        threading.Thread(target=update_node, args=(self.node,)).start()

    def _send_ws(self):
        node = self.node
        ws.send_msg("node.status", {"id": node.id, "status": node.status, 'result': node.result, 'log': node.log})
