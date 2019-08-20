# coding: utf-8
import unittest

from app.ml_engine.schema import InputSchema
from app.ml_engine.spark2.sparkFile import SparkFile


class SourceTest(unittest.TestCase):
    input_schema = None

    def setUp(self):
        self.input_schema = InputSchema({'fileName': 'hdfs://10.110.17.159:8020/tmp/iris.csv', 'limit': 10, 'includeHead': True})
        print 'setUp..'

    def test_load_file(self):
        data_file = SparkFile(self.input_schema)
        schema, sample_data = data_file.get_schema()
        self.assertEqual(schema['targetField'], 4)


if __name__ == '__main__':
    unittest.main()
