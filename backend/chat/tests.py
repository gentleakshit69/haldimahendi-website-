from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from chat.models import ChatSession
from rest_framework_simplejwt.tokens import RefreshToken

class ChatTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create(phone_number='+1000000001', is_verified=True)
        self.user2 = User.objects.create(phone_number='+1000000002', is_verified=True)
        
        self.token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        
    def test_start_chat_session(self):
        url = reverse('start_or_get_chat_session')
        data = {'target_user_id': str(self.user2.id)}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('session_id', response.data)
        
        # Verify session is created in DB
        self.assertEqual(ChatSession.objects.count(), 1)
        session = ChatSession.objects.first()
        self.assertEqual(session.user_one, self.user1)
        self.assertEqual(session.user_two, self.user2)
        
    def test_start_chat_session_with_self(self):
        url = reverse('start_or_get_chat_session')
        data = {'target_user_id': str(self.user1.id)}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_get_chat_history(self):
        session = ChatSession.objects.create(user_one=self.user1, user_two=self.user2)
        url = reverse('get_chat_history', args=[str(session.id)])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('messages', response.data)
        self.assertEqual(len(response.data['messages']), 0)
