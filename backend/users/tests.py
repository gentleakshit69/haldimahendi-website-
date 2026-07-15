from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, OTPVerification

class UserAuthTests(APITestCase):

    def test_send_otp_success(self):
        url = reverse('send_otp')
        data = {'phone_number': '+919876543210'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'OTP sent successfully.')
        self.assertTrue(User.objects.filter(phone_number='+919876543210').exists())
        self.assertTrue(OTPVerification.objects.filter(user__phone_number='+919876543210').exists())

    def test_send_otp_missing_phone(self):
        url = reverse('send_otp')
        data = {}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Phone number is required.')

    def test_verify_otp_success(self):
        # Create user and OTP
        user = User.objects.create(phone_number='+919876543210')
        otp = OTPVerification.objects.create(user=user, otp_code='123456')

        url = reverse('verify_otp')
        data = {
            'phone_number': '+919876543210',
            'otp': '123456'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(response.data['is_new_user'])

        # Check that OTP is marked as used
        otp.refresh_from_db()
        self.assertTrue(otp.is_used)

    def test_verify_otp_invalid(self):
        # Create user first so we get a 400 for bad OTP instead of 404 for missing user
        User.objects.create(phone_number='+919876543210')
        url = reverse('verify_otp')
        data = {
            'phone_number': '+919876543210',
            'otp': '000000'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid or expired OTP.')
