# coding: utf-8
import requests

api_url = 'http://10.110.17.184:8000/hub/api'

r = requests.get(api_url + '/users',
    headers={
             'Authorization': 'token %s' % '52d28ca878054e7fa76edaa94a9c5b76',
            }
    )

r.raise_for_status()
users = r.json()
print(users)