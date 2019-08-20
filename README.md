[![Build Status](https://travis-ci.org/graup/flask-restless-security.svg?branch=master)](https://travis-ci.org/graup/flask-restless-security)

This is a starting point for a [Flask](http://flask.pocoo.org/) website + API using:

- [Flask-Restless](https://flask-restless.readthedocs.org/en/latest/) (API)
- [Flask-Security](https://pythonhosted.org/Flask-Security/) (Authentication)
- [SQLAlchemy](http://www.sqlalchemy.org/) (ORM)

Plus stubs for

- Templates
- Testing



Setup
=====

- Create and activate a vitualenv
- Run `yum install gcc mysql-devel`
- Run `pip install -r requirements.txt`
- Start server using `python run.py`

**Website**

- Access site at /. Not much there, just a basic example for logging in

**Admin**

- Access admin at /admin

**API auth**

- POST /api/v1/auth {'username': '', 'password': ''}
- Returns JSON with {'access_token':''}  
- Then request from API using header 'Authorization: JWT $token'

**Tests**

- Run tests using `python tests/spark_test.py`