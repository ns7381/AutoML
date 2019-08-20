# coding: utf-8
import uuid

from pyspark.sql.types import NumericType

from . import CustomResolver


class Histogram(CustomResolver):
    def __init__(self):
        self.columns = ''

    def resolve(self, df):
        # return [{col_name: _compute(df, col_name)} for col_name in self.columns]
        import matplotlib.pyplot as plt
        plt.figure()
        p_df = df.toPandas()
        p_df.hist(layout=(3, 2))
        file_path = uuid.uuid1()
        plt.savefig(file_path)
        return {'image': file_path+".png"}


def _compute(df, column_name):
    fields = [field for field in df.schema.fields if
              field.name == column_name and isinstance(field.dataType, NumericType)]
    if len(fields) == 1:
        summary = df.describe([column_name]).toPandas()
        summary_dict = {k: v for k, v in summary.values}
        min_val = float(summary_dict['min'])
        max_val = float(summary_dict['max'])
        thresholds = [min_val + i * (max_val - min_val) / 10 for i in range(11)]
        histogram_tuple = df.select(column_name).rdd.flatMap(lambda x: x).histogram(thresholds)
        return summary_dict, histogram_tuple
    else:
        summary = df.groupBy(column_name).count().toPandas()
        summary_dict = {k: v for k, v in summary.values}
        return {"count": df.count()}, (summary_dict.keys(), summary_dict.values())
