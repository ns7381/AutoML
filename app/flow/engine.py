# coding: utf-8
import Queue
import threading

from app import db, app
from app.api.project import get_project_session
from app.flow.processor import Processor
from app.models import ProcessStatus


class ProcessEngine(threading.Thread):

    def __init__(self, project, nodes, edges):
        super(ProcessEngine, self).__init__()
        self.project = project
        self.spark = get_project_session(project.id)
        self.nodes = nodes
        self.edges = edges
        self.executed_nodes = []

    def get_root_nodes(self):
        root_nodes = []
        for node in self.nodes:
            is_root = True
            for edge in self.edges:
                if edge['to']['nodeId'] == node.id:
                    is_root = False
            if is_root:
                root_nodes.append(node)
        return root_nodes

    def get_node(self, id):
        for node in self.nodes:
            if node.id == id:
                return node

    def get_node_from_executed(self, id):
        for node in self.executed_nodes:
            if node.id == id:
                return node

    def get_inputs(self, node):
        input_args = node.input.split(',')
        input_list = [None] * len(input_args)
        for edge in self.edges:
            if edge['to']['nodeId'] == node.id:
                from_node = self.get_node_from_executed(edge['from']['nodeId'])
                if not from_node or from_node.status != ProcessStatus.SUCCESS:
                    return False, None
                from_node_port_index = edge['from']['portIndex'] - 1
                if len(from_node.output.split(',')) > 1:
                    arg_val = from_node.return_tuple[from_node_port_index]
                else:
                    arg_val = from_node.return_tuple
                input_list[edge['to']['portIndex'] - 1] = arg_val
        return True, input_list

    def run(self):
        self.nodes = [db.session.merge(node) for node in self.nodes]
        queue = Queue.Queue()
        executing = 0
        project = db.session.merge(self.project)
        try:
            for root_node in self.get_root_nodes():
                root_node.arg_list = [self.spark]
                processor = Processor(root_node, queue)
                processor.start()
                executing += 1
            while executing > 0:
                executed_node = queue.get()
                self.executed_nodes.append(executed_node)
                executing -= 1
                if executed_node.status == ProcessStatus.SUCCESS:
                    child_nodes = self.get_child_nodes(executed_node.id)
                    for child_node in child_nodes:
                        can_execute, child_node.arg_list = self.get_inputs(child_node)
                        if can_execute:
                            processor = Processor(child_node, queue)
                            processor.start()
                            executing += 1

            project.status = ProcessStatus.SUCCESS
        except Exception as e:
            project.status = ProcessStatus.ERROR
            app.logger.exception(str(e))
        finally:
            project.update()
            db.session.close()
            if self.spark:
                self.spark.stop()

    def get_child_nodes(self, id):
        child_nodes = []
        for edge in self.edges:
            if edge['from']['nodeId'] == id:
                child_nodes.append(self.get_node(edge['to']['nodeId']))
        return child_nodes
