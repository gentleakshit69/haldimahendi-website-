import os
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import AIOnboardingSession
from django.contrib.auth import get_user_model
from openai import AsyncOpenAI
import base64
import time

User = get_user_model()
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY must be set in the environment")

openai_client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY must be set in the environment")

SYSTEM_PROMPT = """
You are an empathetic, professional, and friendly female matrimonial assistant named 'Priya'.
Your job is to interview the user and collect all necessary details to build their matrimonial profile.
You should ask ONE question at a time. Be conversational, psychologically encouraging, and polite.
Required details to collect: Full Name, Date of Birth, Profession, Height, Religion/Caste, and Partner Expectations.
Once you have collected all these details, kindly let them know the profile is complete.
"""

class AvatarOnboardingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        # In production, derive user from self.scope['user']
        # For prototype, we will create an anonymous session or fetch the first user
        self.user = await self.get_or_create_dummy_user()
        self.session = await self.get_or_create_session(self.user)
        
        if not self.session.conversation_state:
            self.session.conversation_state = [{"role": "system", "content": SYSTEM_PROMPT}]
            await self.save_session()
        
        welcome_text = "Namaste! Welcome to our platform. I am Priya, your personal assistant. Let's get your profile set up so you can find your perfect match. What is your full name?"
        
        # Generate initial voice
        audio_base64 = await self.generate_speech(welcome_text)
        
        await self.send(text_data=json.dumps({
            'type': 'avatar_response',
            'text': welcome_text,
            'audio_base64': audio_base64
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user_message = text_data_json.get('text', '')
        
        if not user_message:
            return

        # 1. Append user message to state
        state = self.session.conversation_state
        state.append({"role": "user", "content": user_message})
        
        # 2. Call LLM
        try:
            response = await openai_client.chat.completions.create(
                model="meta-llama/llama-3-8b-instruct",
                messages=state
            )
            bot_reply = response.choices[0].message.content
        except Exception as e:
            print("OpenAI Error:", e)
            bot_reply = "I'm sorry, I didn't quite catch that. Could you repeat?"

        # 3. Append bot reply to state and save
        state.append({"role": "assistant", "content": bot_reply})
        self.session.conversation_state = state
        await self.save_session()
        
        # 4. Generate TTS audio
        audio_base64 = await self.generate_speech(bot_reply)

        # 5. Send back to frontend
        await self.send(text_data=json.dumps({
            'type': 'avatar_response',
            'text': bot_reply,
            'audio_base64': audio_base64
        }))

    async def generate_speech(self, text):
        # We use a dummy implementation for the prototype if API key is missing
        if ELEVENLABS_API_KEY == "dummy_key":
            return "mock_base64_audio_data_here"
            
        import httpx
        url = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL" # Bella voice ID
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            if response.status_code == 200:
                return base64.b64encode(response.content).decode('utf-8')
        return ""

    @sync_to_async
    def get_or_create_dummy_user(self):
        user, _ = User.objects.get_or_create(phone_number="+910000000000")
        return user

    @sync_to_async
    def get_or_create_session(self, user):
        session, _ = AIOnboardingSession.objects.get_or_create(user=user, is_completed=False)
        return session

    @sync_to_async
    def save_session(self):
        self.session.save()
