import os
import django
import json
from django.test.client import RequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.views import send_otp

factory = RequestFactory()
request = factory.post('/api/auth/request-otp/', data=json.dumps({'phone_number': '7888327471'}), content_type='application/json')
response = send_otp(request)

print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.data}")
