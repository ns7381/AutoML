import json
import unittest

from const import iris
from ml import ML
from resource import Source, Training


class TestSource(unittest.TestCase):
    def setUp(self):
        # df = df.withColumn("sepallength", df["sepallength"].cast(DoubleType()))
        # df = df.withColumn("sepalwidth", df["sepalwidth"].cast(DoubleType()))
        # df = df.withColumn("petallength", df["petallength"].cast(DoubleType()))
        # df = df.withColumn("petalwidth", df["petalwidth"].cast(DoubleType()))
        # df = df.withColumn("class", df["class"].alias("class", metadata={"label": True}))
        print('setUp...')

    def tearDown(self):
        print('tearDown...')

    def testCSV(self):
        ml = ML()
        # ml.compute_statistics(iris, "sepallength")
        t = Training("classification", "LogisticRegression",
                     {"maxIter": 10, "regParam": 0.3, "elasticNetParam": 0.8, "family": "multinomial"}, 0.7, iris, "./model/lr")
        # ml.train_model(t)
        ml.model_predict_single(t, iris)

    def testLibsvm(self):
        s = Source("../data/test.data", "csv", json.dumps({"header": True, "delimiter": ","}), {})
        ml = ML()
        df = ml.read_source(s)
        print(df.schema.json())

    def testJDBC(self):
        s = Source("", "jdbc", json.dumps({"url": "jdbc:mysql://10.110.17.222/insight_ml",
                                           "driver": "com.mysql.jdbc.Driver",
                                           "dbtable": "user_info",
                                           "user": "root",
                                           "password": ""}), {})
        ml = ML()
        df = ml.read_source(s)
        ml.compute_statistics(s, "user_name")
        print(df.schema.json())


if __name__ == '__main__':
    unittest.main()
