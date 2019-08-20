import unittest

from pyspark.ml.classification import LogisticRegression

from const import sample_libsvm_data, iris, sample_multiclass_classification_data
from ml import ML
from resource import Training


class TestTraining(unittest.TestCase):
    def setUp(self):
        print('setUp...')

    def tearDown(self):
        print('tearDown...')

    def testLinearSVC(self):
        ml = ML()
        t = Training("classification", "LinearSVC",
                     {"maxIter": 10, "regParam": 0.3}, 0.7, sample_libsvm_data, "./model/svc")
        ml.train_model(t)

    def testLogisticRegression(self):
        ml = ML()
        t = Training("classification", "LogisticRegression",
                     {"maxIter": 10, "regParam": 0.3, "elasticNetParam": 0.8, "family": "multinomial"}, 0.7, iris,
                     "./model/lr")
        ml.train_model(t)

    def testDecisionTreeClassifier(self):
        ml = ML()
        t = Training("classification", "DecisionTreeClassifier",
                     {"maxDepth": 10}, 0.7, sample_libsvm_data, "./model/dt")
        print(ml.train_model(t))

    def testRandomForestClassifier(self):
        ml = ML()
        t = Training("classification", "RandomForestClassifier",
                     {"maxDepth": 10}, 0.7, sample_libsvm_data, "./model/rf")
        print(ml.train_model(t))

    def testGBTClassifier(self):
        ml = ML()
        t = Training("classification", "GBTClassifier",
                     {"maxDepth": 10}, 0.7, sample_libsvm_data, "./model/gbt")
        print(ml.train_model(t))

    def testNaiveBayes(self):
        ml = ML()
        t = Training("classification", "NaiveBayes",
                     {"smoothing": 2.0}, 0.7, sample_libsvm_data, "./model/bayes")
        print(ml.train_model(t))

    def testMultilayerPerceptronClassifier(self):
        # TODO param layers is neccesary
        ml = ML()
        t = Training("classification", "MultilayerPerceptronClassifier",
                     {"layers": [4, 5, 4, 3]}, 0.7, sample_multiclass_classification_data, "./model/mlp")
        print(ml.train_model(t))

    def testOneVsRest(self):
        # TODO param classifier is neccesary
        ml = ML()
        t = Training("classification", "OneVsRest",
                     {"maxIter": 10}, 0.7, sample_multiclass_classification_data, "./model/ovr")
        print(ml.train_model(t))


if __name__ == '__main__':
    unittest.main()
