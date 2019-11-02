import os

import setuptools

setuptools.setup(
    name='insight-ml',
    version='2018.09.13',
    keywords='machine learning',
    description='A webapp for machine learning',
    long_description=open(
        os.path.join(
            os.path.dirname(__file__),
            'README.md'
        )
    ).read(),
    install_requires=[
        'matplotlib==2.1.2',
        'pandas==0.22.0',
        'Flask==1.0',
        'Flask_SQLAlchemy==2.1',
        'Flask_RESTful==0.3.6',
        'pyspark==2.2.1',
        'gevent==1.2.2',
        'Flask_Security==3.0.0',
        'flask_marshmallow==0.8.0',
        'numpy==1.14.0',
        'gevent_websocket==0.10.1',
        'scikit_learn==0.19.1',
        'marshmallow-sqlalchemy==0.13.2',
        'mysql-python>=1.2.3',
        'bcrypt==3.1.4',
        'enum34',
        'requests'
    ],
    author='Nathan',
    author_email='ningsheng@inspur.com',

    url='https://git.inspur.com/Insight/ML/insight-ml-app.git',
    packages=setuptools.find_packages(),
    license='MIT'
)
