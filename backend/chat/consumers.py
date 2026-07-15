import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatSession, ChatMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'chat_{self.session_id}'

        # Ensure user is authenticated
        if not self.scope['user'].is_authenticated:
            await self.close()
            return

        # Check if user is part of the session
        is_participant = await self.is_user_in_session(self.session_id, self.scope['user'])
        if not is_participant:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json.get('message_content')

        if not message_content:
            return

        # Save message to database
        saved_message = await self.save_message(self.session_id, self.scope['user'], message_content)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': str(saved_message.id),
                'sender_id': str(self.scope['user'].id),
                'sender_phone': self.scope['user'].phone_number,
                'message_content': saved_message.message_content,
                'sent_at': saved_message.sent_at.isoformat(),
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'sender_id': event['sender_id'],
            'sender_phone': event['sender_phone'],
            'message_content': event['message_content'],
            'sent_at': event['sent_at'],
        }))

    @database_sync_to_async
    def is_user_in_session(self, session_id, user):
        try:
            session = ChatSession.objects.get(id=session_id)
            return user == session.user_one or user == session.user_two
        except ChatSession.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, session_id, sender, message_content):
        session = ChatSession.objects.get(id=session_id)
        return ChatMessage.objects.create(
            session=session,
            sender=sender,
            message_content=message_content
        )
