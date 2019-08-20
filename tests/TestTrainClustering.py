import unittest

from pyspark.ml.classification import LogisticRegression

from const import sample_libsvm_data, iris, sample_kmeans_data, sample_lda_libsvm_data
from ml import ML
from resource import Training


class TestTrainClustering(unittest.TestCase):
    def setUp(self):
        print('setUp...')

    def tearDown(self):
        # os.system("rmdir /s /q ./model")
        print('tearDown...')

    def testGaussianMixture(self):
        ml = ML()
        t = Training("clustering", "GaussianMixture", {"maxIter": 99}, 0.7, sample_kmeans_data, "./model/gm")
        print(ml.train_model(t))

    def testKMeans(self):
        ml = ML()
        t = Training("clustering", "KMeans", {}, 0.7, sample_kmeans_data, "./model/kmeans")
        print(ml.train_model(t))

    def testBisectingKMeans(self):
        ml = ML()
        t = Training("clustering", "BisectingKMeans", {}, 0.7, sample_kmeans_data, "./model/bkmeans")
        print(ml.train_model(t))

    def testLDA(self):
        ml = ML()
        t = Training("clustering", "LDA", {}, 0.7, sample_lda_libsvm_data, "./model/lda")
        print(ml.train_model(t))


if __name__ == '__main__':
    unittest.main()
