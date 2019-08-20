
import logging

class Config(object):

    DEBUG = False
    TESTING = False

    # Flask-Security
    SECRET_KEY = 'ml_secret_key'
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization'
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_MAX_AGE = 3600
    SECURITY_PASSWORD_SALT = 'sdfyvghter'
    SECURITY_UNAUTHORIZED_VIEW = '/'

    # Database config
    SQLALCHEMY_DATABASE_URI = 'mysql://root:bigdata@localhost/insight_ml'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_POOL_SIZE = 100

    # Spark
    SPARK_MASTER = "yarn"
    SPARK_APP_NAME = "ml-app"

    # Logging
    LOGGING_FORMAT = '%(asctime)s - %(filename)s:%(lineno)s - func: [%(name)s] - %(message)s'
    LOGGING_LOCATION = '/var/log/ml/ml-app.log'
    LOGGING_LEVEL = logging.ERROR