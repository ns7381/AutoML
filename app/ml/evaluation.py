# coding: utf-8
from pyspark.ml.clustering import KMeansModel, BisectingKMeansModel
from pyspark.ml.evaluation import BinaryClassificationEvaluator as bce, MulticlassClassificationEvaluator as mce, \
    RegressionEvaluator as re

from . import CustomResolver


class ClassificationEvaluator(CustomResolver):
    def __init__(self, predictionCol, labelCol):
        self.predictionCol = predictionCol
        self.labelCol = labelCol

    def resolve(self, df):
        result = [{'F1测量': mce(predictionCol=self.predictionCol, labelCol=self.labelCol, metricName="f1").evaluate(df)},
                  {'精确率': mce(predictionCol=self.predictionCol, labelCol=self.labelCol,
                              metricName="weightedPrecision").evaluate(df)},
                  {'召回率': mce(predictionCol=self.predictionCol, labelCol=self.labelCol,
                              metricName="weightedRecall").evaluate(df)},
                  {'准确率': mce(predictionCol=self.predictionCol, labelCol=self.labelCol, metricName="accuracy").evaluate(
                      df)}]
        if "rawPrediction" in df.columns:
            result.append({"ROC曲线下面积": bce(labelCol=self.labelCol, metricName="areaUnderROC").evaluate(df)})
            result.append({"PR曲线下面积": bce(labelCol=self.labelCol, metricName="areaUnderPR").evaluate(df)})
        return result


class RegressionEvaluator(CustomResolver):
    def __init__(self, predictionCol, labelCol):
        self.predictionCol = predictionCol
        self.labelCol = labelCol

    def resolve(self, df):
        rmse = re(predictionCol=self.predictionCol, labelCol=self.labelCol, metricName="rmse").evaluate(df)
        mse = re(predictionCol=self.predictionCol, labelCol=self.labelCol, metricName="mse").evaluate(df)
        r2 = re(predictionCol=self.predictionCol, labelCol=self.labelCol, metricName="r2").evaluate(df)
        mae = re(predictionCol=self.predictionCol, labelCol=self.labelCol, metricName="mae").evaluate(df)
        return [{"均方根误差": rmse}, {"均方误差": mse}, {"R方": r2}, {"平均绝对误差": mae}]


class ClusterEvaluator(CustomResolver):
    def __init__(self):
        pass

    def resolve(self, model, df):
        result = []
        if 'clustering' in model.__module__:
            result.append({"聚类数量": model.summary.k})
            result.append({"聚类包含数据个数": str(model.summary.clusterSizes)})
            if isinstance(model, KMeansModel) or isinstance(model, BisectingKMeansModel):
                result.append({'聚类结果误差平方和': model.computeCost(df)})
                for center in model.clusterCenters():
                    result.append({'中心点坐标', ','.join(str(j) for j in center)})
            return result
