# coding: utf-8
import unittest

from pyspark.ml import Pipeline
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.feature import Tokenizer, HashingTF
from pyspark.sql import SparkSession

from app.ml_engine.schema import InputSchema
from app.ml_engine.spark2 import sparkEngine, sparkFile
from app.ml_engine.spark2.sparkModel import SparkModel_ML
from app.ml_engine.spark2.train import TrainModel


class ModelTest(unittest.TestCase):
    input_schema = None

    def setUp(self):
        self.input_schema = InputSchema(
            {'fileName': 'hdfs://10.110.17.159:8020/tmp/iris.csv', 'limit': 10, 'includeHead': True,
             'schema': {"fields": [
                 {"index": "0", "name": "sepallength", "normal": False, "feature": True, "type": "Numeric",
                  "target": False},
                 {"index": "1", "name": "sepalwidth", "normal": False, "feature": True, "type": "Numeric",
                  "target": False},
                 {"index": "2", "name": "petallength", "normal": False, "feature": True, "type": "Numeric",
                  "target": False},
                 {"index": "3", "name": "petalwidth", "normal": False, "feature": True, "type": "Numeric",
                  "target": False},
                 {"index": "4", "name": "class", "normal": False, "feature": False, "type": "Text", "target": True}],
                 "targetField": 4},
             'train': {'ds': 'all', 'model': 'bayes_classification', 'split': 66}})
        print 'setUp..'

    def untest_save_load1(self):
        # sc = sparkEngine.getSparkSession()
        sc = SparkSession.builder.master("local").appName("localtest").getOrCreate()
        training = sc.createDataFrame([
            (0, "a b c d e spark", 1.0),
            (1, "b d", 0.0),
            (2, "spark f g h", 1.0),
            (3, "hadoop mapreduce", 0.0)
        ], ["id", "text", "label"])
        tokenizer = Tokenizer(inputCol="text", outputCol="words")
        hashingTF = HashingTF(inputCol=tokenizer.getOutputCol(), outputCol="features")
        lr = LogisticRegression(maxIter=10, regParam=0.001)
        pipeline = Pipeline(stages=[tokenizer, hashingTF, lr])
        model = pipeline.fit(training)
        model.save("/var/lib/ml-app/test_save1")
        saved_model = model.load("/var/lib/ml-app/test_save1")
        print(saved_model)

    def test_save_load2(self):
        trainer = TrainModel(self.input_schema)
        spark_session = sparkEngine.getSparkSession()
        df = sparkFile.get_spark_dataframe(spark_session, self.input_schema)
        training, test, stringIndexLabels = SparkModel_ML(self.input_schema, spark_session).getFormatData(df, 0)
        model = trainer.getTrainModel(0, training)
        model.save("/var/lib/ml-app/test_save3")
        saved_model = model.load("/var/lib/ml-app/test_save3")
        print(saved_model)


if __name__ == '__main__':
    unittest.main()
