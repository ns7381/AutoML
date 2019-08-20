import dill
from pyspark.ml import Transformer, Pipeline, PipelineModel
from pyspark.ml.param import Param, Params
from pyspark.ml.util import Identifiable, MLReadable, MLWritable, JavaMLReader, JavaMLWriter
from pyspark.ml.feature import StopWordsRemover
from pyspark.ml.wrapper import JavaParams
from pyspark.context import SparkContext
from pyspark.sql import Row, SparkSession


class PysparkObjId(object):
    """
    A class to specify constants used to idenify and setup python
    Estimators, Transformers and Models so they can be serialized on there
    own and from within a Pipline or PipelineModel.
    """

    def __init__(self):
        super(PysparkObjId, self).__init__()

    @staticmethod
    def _getPyObjId():
        return '4c1740b00d3c4ff6806a1402321572cb'

    @staticmethod
    def _getCarrierClass(javaName=False):
        return 'org.apache.spark.ml.feature.StopWordsRemover' if javaName else StopWordsRemover


class PysparkPipelineWrapper(object):
    """
    A class to facilitate converting the stages of a Pipeline or PipelineModel
    that were saved from PysparkReaderWriter.
    """

    def __init__(self):
        super(PysparkPipelineWrapper, self).__init__()

    @staticmethod
    def unwrap(pipeline):
        if not (isinstance(pipeline, Pipeline) or isinstance(pipeline, PipelineModel)):
            raise TypeError("Cannot recognize a pipeline of type %s." % type(pipeline))

        stages = pipeline.getStages() if isinstance(pipeline, Pipeline) else pipeline.stages
        for i, stage in enumerate(stages):
            if (isinstance(stage, Pipeline) or isinstance(stage, PipelineModel)):
                stages[i] = PysparkPipelineWrapper.unwrap(stage)
            if isinstance(stage, PysparkObjId._getCarrierClass()) and stage.getStopWords()[
                -1] == PysparkObjId._getPyObjId():
                swords = stage.getStopWords()[:-1]  # strip the id
                lst = [chr(int(d)) for d in swords]
                dmp = ''.join(lst)
                py_obj = dill.loads(dmp)
                stages[i] = py_obj

        if isinstance(pipeline, Pipeline):
            pipeline.setStages(stages)
        else:
            pipeline.stages = stages
        return pipeline


class PysparkReaderWriter(object):
    """
    A mixin class so custom pyspark Estimators, Transformers and Models may
    support saving and loading directly or be saved within a Pipline or PipelineModel.
    """

    def __init__(self):
        super(PysparkReaderWriter, self).__init__()

    def write(self):
        """Returns an MLWriter instance for this ML instance."""
        return JavaMLWriter(self)

    @classmethod
    def read(cls):
        """Returns an MLReader instance for our clarrier class."""
        return JavaMLReader(PysparkObjId._getCarrierClass())

    @classmethod
    def load(cls, path):
        """Reads an ML instance from the input path, a shortcut of `read().load(path)`."""
        swr_java_obj = cls.read().load(path)
        return cls._from_java(swr_java_obj)

    @classmethod
    def _from_java(cls, java_obj):
        """
        Get the dumby the stopwords that are the characters of the dills dump plus our guid
        and convert, via dill, back to our python instance.
        """
        swords = java_obj.getStopWords()[:-1]  # strip the id
        lst = [chr(int(d)) for d in swords]  # convert from string integer list to bytes
        dmp = ''.join(lst)
        py_obj = dill.loads(dmp)
        return py_obj

    def _to_java(self):
        """
        Convert this instance to a dill dump, then to a list of strings with the unicode integer values of each character.
        Use this list as a set of dumby stopwords and store in a StopWordsRemover instance
        :return: Java object equivalent to this instance.
        """
        dmp = dill.dumps(self)
        pylist = [str(ord(d)) for d in dmp]  # convert byes to string integer list
        pylist.append(PysparkObjId._getPyObjId())  # add our id so PysparkPipelineWrapper can id us.
        sc = SparkContext._active_spark_context
        java_class = sc._gateway.jvm.java.lang.String
        java_array = sc._gateway.new_array(java_class, len(pylist))
        for i in xrange(len(pylist)):
            java_array[i] = pylist[i]
        _java_obj = JavaParams._new_java_obj(PysparkObjId._getCarrierClass(javaName=True), self.uid)
        _java_obj.setStopWords(java_array)
        return _java_obj


class HasFake(Params):
    def __init__(self):
        super(HasFake, self).__init__()
        self.fake = Param(self, "fake", "fake param")

    def getFake(self):
        return self.getOrDefault(self.fake)


class MockTransformer(Transformer, HasFake, Identifiable):
    def __init__(self):
        super(MockTransformer, self).__init__()
        self.dataset_count = 0

    def _transform(self, dataset):
        self.dataset_count = dataset.count()
        return dataset


class MyTransformer(MockTransformer, Identifiable, PysparkReaderWriter, MLReadable, MLWritable):
    def __init__(self):
        super(MyTransformer, self).__init__()


def make_a_dataframe(sc):
    df = sc.parallelize([Row(name='Alice', age=5, height=80), Row(name='Alice', age=5, height=80),
                         Row(name='Alice', age=10, height=80)]).toDF()
    return df


def test1():
    trA = MyTransformer()
    trA.dataset_count = 999
    print trA.dataset_count
    trA.save('test.trans')
    trB = MyTransformer.load('test.trans')
    print trB.dataset_count


def test2():
    trA = MyTransformer()
    pipeA = Pipeline(stages=[trA])
    print type(pipeA)
    pipeA.save('testA.pipe')
    pipeAA = PysparkPipelineWrapper.unwrap(Pipeline.load('testA.pipe'))
    stagesAA = pipeAA.getStages()
    trAA = stagesAA[0]
    print trAA.dataset_count


def test3():
    sparkSession = SparkSession.builder.master("local[*]").appName("test").config("spark.jars", "file:///E:/tmp/mysql-connector-java-5.1.39.jar").getOrCreate()
    dfA = make_a_dataframe(sparkSession.sparkContext)
    trA = MyTransformer()
    pipeA = Pipeline(stages=[trA]).fit(dfA)
    print type(pipeA)
    pipeA.save('testB.pipe')
    pipeAA = PysparkPipelineWrapper.unwrap(PipelineModel.load('testB.pipe'))
    stagesAA = pipeAA.stages
    trAA = stagesAA[0]
    print trAA.dataset_count
    dfB = pipeAA.transform(dfA)
    dfB.show()


if __name__ == "__main__":
    test3()
