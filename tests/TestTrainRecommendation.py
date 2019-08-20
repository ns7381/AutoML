import unittest

from pyspark.ml.classification import LogisticRegression

from const import sample_libsvm_data, iris, sample_kmeans_data, test
from ml import ML
from resource import Training


class TestTrainRecommendation(unittest.TestCase):
    def setUp(self):
        print('setUp...')

    def tearDown(self):
        # os.system("rmdir /s /q ./model")
        print('tearDown...')

    def testALS(self):
        ml = ML()
        t = Training("recommendation", "ALS", {"maxIter": 9}, 0.7, test, "./model/als")
        ml.model_predict_single()
        print(ml.train_model(t))


if __name__ == '__main__':
    unittest.main()
