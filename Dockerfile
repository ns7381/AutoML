FROM spark-ml:v2.2.1-b1
ADD app /opt/ml/app
ADD static /opt/ml/static
ADD config.py /opt/ml/config.py
ADD run.py /opt/ml/run.py
WORKDIR /opt/ml
ENV APP_SETTINGS=config.DevelopmentConfig
CMD [ "sh", "-c", "python run.py" ]