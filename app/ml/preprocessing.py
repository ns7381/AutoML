# coding: utf-8
from pyspark.sql.types import DoubleType, IntegerType, StringType

from . import CustomResolver


class Splitter(CustomResolver):
    def __init__(self, rating):
        if isinstance(rating, basestring):
            rating = float(rating)
        self.rating = rating

    def resolve(self, df):
        return df.randomSplit([self.rating, 1 - self.rating])


class TypeConverter(CustomResolver):
    def __init__(self, double_columns, int_columns, string_columns):
        self.double_columns = double_columns
        self.int_columns = int_columns
        self.string_columns = string_columns

    def resolve(self, df):
        for col in self.double_columns:
            df = df.withColumn(col, df[col].cast(DoubleType()))
        for col in self.int_columns:
            df = df.withColumn(col, df[col].cast(IntegerType()))
        for col in self.double_columns:
            df = df.withColumn(col, df[col].cast(StringType()))
        return df
