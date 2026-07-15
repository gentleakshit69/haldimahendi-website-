from django.urls import path
from .views import get_chat_history, start_or_get_chat_session

urlpatterns = [
    path('session/', start_or_get_chat_session, name='start_or_get_chat_session'),
    path('history/<uuid:session_id>/', get_chat_history, name='get_chat_history'),
]
