# coding: utf-8

from . import CustomResolver


class Predict(CustomResolver):
    def __init__(self):
        pass

    def resolve(self, model, df):
        return model.transform(df)
