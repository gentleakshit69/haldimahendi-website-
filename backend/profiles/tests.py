from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from profiles.models import Profile, Preference
from rest_framework_simplejwt.tokens import RefreshToken
import tempfile

class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(phone_number='+1234567890', is_verified=True)
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        
    def test_get_my_profile_empty(self):
        url = reverse('my_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('profile', response.data)
        
    def test_patch_my_profile(self):
        url = reverse('my_profile')
        data = {
            'full_name': 'Test User',
            'hobbies': 'Reading',
            'min_age': 25
        }
        response = self.client.patch(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify DB updates
        profile = Profile.objects.get(user=self.user)
        self.assertEqual(profile.full_name, 'Test User')
        self.assertEqual(profile.hobbies, 'Reading')
        
        preference = Preference.objects.get(profile=profile)
        self.assertEqual(preference.min_age, 25)

    def test_parse_biodata_mock(self):
        url = reverse('parse_biodata')
        # We simulate a text upload to bypass file handling complexity in this test
        data = {'text': 'Name: Alice, DOB: 1995-01-01, Profession: Engineer'}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('structured_data', response.data)
        
    def test_search_profiles(self):
        # Create a mock profile to search
        Profile.objects.create(user=self.user, full_name='Alice Smith', gender='Female')
        
        url = reverse('search_profiles')
        response = self.client.get(url, {'q': 'Alice'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
