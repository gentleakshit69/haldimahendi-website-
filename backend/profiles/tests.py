from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from .models import Profile

class ProfileTests(APITestCase):

    def setUp(self):
        # Create a user to authenticate
        self.user = User.objects.create(phone_number='+919876543210', is_verified=True)
        # Force authentication for our test client
        self.client.force_authenticate(user=self.user)

    def test_search_profiles(self):
        # Create some dummy profiles
        Profile.objects.create(
            user=self.user,
            full_name="John Doe",
            gender="Male",
            religion="Hindu",
            occupation="Engineer",
            location_city="Mumbai"
        )
        
        other_user = User.objects.create(phone_number='+919876543211', is_verified=True)
        Profile.objects.create(
            user=other_user,
            full_name="Jane Doe",
            gender="Female",
            religion="Christian",
            occupation="Doctor",
            location_city="Delhi"
        )

        url = reverse('search_profiles')
        
        # Test generic search
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

        # Test filtering by gender
        response_gender = self.client.get(url, {'gender': 'Female'})
        self.assertEqual(response_gender.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_gender.data['results']), 1)
        self.assertEqual(response_gender.data['results'][0]['full_name'], 'Jane Doe')

    def test_search_profiles_unauthenticated(self):
        # Remove authentication
        self.client.force_authenticate(user=None)
        
        url = reverse('search_profiles')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_parse_biodata_text_only(self):
        url = reverse('parse_biodata')
        data = {
            'text': 'Name: Sourabh, Age: 26, Profession: Developer'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('structured_data', response.data)
