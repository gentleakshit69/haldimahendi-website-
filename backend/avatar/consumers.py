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

CRITICAL INSTRUCTION: As soon as the user provides ANY of the required details (even partially, like just their name or profession), you MUST immediately call the 'update_profile' function to save that data before you respond with your next question.
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

        # Join user-specific group for real-time webhook updates
        self.group_name = f"user_{self.user.id}"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def profile_updated(self, event):
        """
        Called when the webhook pushes an update to the user's group.
        """
        await self.send(text_data=json.dumps({
            'type': 'profile_updated',
            'payload': event['payload']
        }))

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user_message = text_data_json.get('text', '')
        
        if not user_message:
            return

        # 1. Append user message to state
        state = self.session.conversation_state
        state.append({"role": "user", "content": user_message})
        
        # 2. Define tools
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "update_profile",
                    "description": "Updates the user's matrimonial profile with extracted information.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "full_name": {"type": "string"},
                            "occupation": {"type": "string"},
                            "date_of_birth": {"type": "string", "description": "YYYY-MM-DD"},
                            "height": {"type": "string"},
                            "religion": {"type": "string"},
                            "expectations": {"type": "string"}
                        }
                    }
                }
            }
        ]

        # 3. Call LLM
        try:
            response = await openai_client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=state,
                tools=tools,
                tool_choice={"type": "function", "function": {"name": "update_profile"}}
            )
            response_message = response.choices[0].message
            bot_reply = response_message.content or ""
            
            # 4. Handle Tool Calls
            if response_message.tool_calls:
                state.append(response_message.model_dump())
                for tool_call in response_message.tool_calls:
                    if tool_call.function.name == "update_profile":
                        args = json.loads(tool_call.function.arguments)
                        await self.update_user_profile(args)
                        
                        # Notify frontend of profile update
                        await self.channel_layer.group_send(
                            self.group_name,
                            {
                                'type': 'profile_updated',
                                'payload': args
                            }
                        )
                        
                        state.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": json.dumps({"status": "success", "message": "Profile updated."})
                        })
                
                # Get follow-up message from LLM after tool call
                followup_response = await openai_client.chat.completions.create(
                    model="openai/gpt-4o-mini",
                    messages=state
                )
                bot_reply = followup_response.choices[0].message.content
                state.append({"role": "assistant", "content": bot_reply})
            else:
                state.append({"role": "assistant", "content": bot_reply})
                
        except Exception as e:
            print("OpenAI Error:", e)
            bot_reply = "I'm sorry, I didn't quite catch that. Could you repeat?"
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
    def update_user_profile(self, data):
        from profiles.models import Profile
        profile, _ = Profile.objects.get_or_create(user=self.user)
        if 'full_name' in data: profile.full_name = data['full_name']
        if 'occupation' in data: profile.occupation = data['occupation']
        if 'date_of_birth' in data: profile.date_of_birth = data['date_of_birth']
        if 'height' in data: profile.height = data['height']
        if 'religion' in data: profile.religion = data['religion']
        if 'expectations' in data: profile.about_me = (profile.about_me or "") + "\nExpectations: " + data['expectations']
        profile.status = 'draft' # Ensuring it remains draft during partial saves
        profile.save()

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
