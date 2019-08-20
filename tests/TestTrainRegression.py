import unittest

from pyspark.ml.classification import LogisticRegression

from const import sample_libsvm_data, iris, sample_linear_regression_data
from ml import ML
from resource import Training


class TestTrainRegression(unittest.TestCase):
    def setUp(self):
        print('setUp...')

    def tearDown(self):
        # os.system("rmdir /s /q ./model")
        print('tearDown...')

    def testLinearRegression(self):
        ml = ML()
        t = Training("regression", "LinearRegression",
                     {"maxIter": 99}, 0.7, sample_linear_regression_data, "./model/linear")
        print(ml.train_model(t))

    def testIsotonicRegression(self):
        ml = ML()
        t = Training("regression", "IsotonicRegression",
                     {}, 0.7, sample_linear_regression_data, "./model/isotonic")
        print(ml.train_model(t))

    def testDecisionTreeRegressor(self):
        ml = ML()
        t = Training("regression", "DecisionTreeRegressor",
                     {}, 0.7, sample_libsvm_data, "./model/dtr")
        print(ml.train_model(t))

    def testRandomForestRegressor(self):
        ml = ML()
        t = Training("regression", "RandomForestRegressor",
                     {"maxDepth": 5}, 0.7, sample_libsvm_data, "./model/rfr")
        print(ml.train_model(t))

    def testGBTRegressor(self):
        ml = ML()
        t = Training("regression", "GBTRegressor",
                     {"maxDepth": 6}, 0.7, sample_libsvm_data, "./model/gbtr")
        print(ml.train_model(t))

    def testAFTSurvivalRegression(self):
        # TODO not have test data
        ml = ML()
        t = Training("regression", "AFTSurvivalRegression",
                     {}, 0.7, sample_libsvm_data, "./model/aftsr")
        print(ml.train_model(t))

    def testGeneralizedLinearRegression(self):
        ml = ML()
        t = Training("regression", "GeneralizedLinearRegression",
                     {"regParam": 0.3}, 0.7, sample_linear_regression_data, "./model/glr")
        print(ml.train_model(t))


if __name__ == '__main__':
    unittest.main()
