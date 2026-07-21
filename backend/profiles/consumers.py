import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # We assume the user is authenticated. In a real scenario, you'd check self.scope['user']
        # if TokenAuthMiddleware is used, or pass token in query string.
        # For simplicity, we just use the user ID from the path or query, or from scope if auth is set up.
        
        # Let's assume user is in self.scope['user'] or we extract user_id from query params.
        # Since standard SessionMiddleware might not pass user via WebSockets natively without TokenAuthMiddleware,
        # we'll look for user in scope or just accept a generic group for now. 
        # Ideally, you'll want to add Token auth middleware, but we'll use a simple approach:
        
        # Assuming the connection is `/ws/notifications/` and we identify the user by scope:
        if self.scope["user"].is_anonymous:
            # You might want to close if anonymous, but we'll allow it for now if auth isn't fully wired for WS.
            # In a production app, use: await self.close()
            user_id = 'anonymous'
        else:
            user_id = str(self.scope["user"].id)

        # Allow passing user_id in query string as fallback (for testing)
        query_string = self.scope.get('query_string', b'').decode()
        if 'user_id=' in query_string:
            user_id = query_string.split('user_id=')[1].split('&')[0]

        self.room_group_name = f'user_notifications_{user_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        # We don't really expect frontend to send messages here, just listen
        pass

    async def send_notification(self, event):
        # This handler will be called when we do group_send
        await self.send(text_data=json.dumps(event['message']))
