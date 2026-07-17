from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/avatar/onboarding/', consumers.AvatarOnboardingConsumer.as_asgi()),
]
