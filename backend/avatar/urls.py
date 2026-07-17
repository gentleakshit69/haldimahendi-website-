from django.urls import path
from .views import AvatarSessionCreateView, AvatarWebhookView

app_name = 'avatar'

urlpatterns = [
    path('session/', AvatarSessionCreateView.as_view(), name='session_create'),
    path('webhook/', AvatarWebhookView.as_view(), name='webhook'),
]
