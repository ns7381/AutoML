# coding: utf-8
from . import CustomResolver


class IndexToString(CustomResolver):
    def __init__(self, inputCol, outputCol, origin):
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.origin = origin

    def resolve(self, df):
        from pyspark.ml.feature import IndexToString as IndexToString2
        labels = df.toPandas()[self.origin].unique().tolist()
        return IndexToString2(inputCol=self.inputCol, outputCol=self.outputCol, labels=labels).transform(df)
