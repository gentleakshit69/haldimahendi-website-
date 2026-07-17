from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User, OTPVerification

class AuthenticationTests(APITestCase):
    def test_send_otp(self):
        url = reverse('send_otp')
        data = {'phone_number': '+1234567890'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(OTPVerification.objects.count(), 1)

    def test_verify_otp(self):
        # Setup: Send OTP first
        self.client.post(reverse('send_otp'), {'phone_number': '+1234567890'}, format='json')
        otp_record = OTPVerification.objects.first()
        
        # Verify
        url = reverse('verify_otp')
        data = {'phone_number': '+1234567890', 'otp': otp_record.otp_code}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(response.data['is_new_user'])
        
    def test_verify_invalid_otp(self):
        self.client.post(reverse('send_otp'), {'phone_number': '+1234567890'}, format='json')
        
        url = reverse('verify_otp')
        data = {'phone_number': '+1234567890', 'otp': '000000'}  # Invalid OTP
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
