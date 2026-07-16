from django.contrib import admin
from .models import ChatSession, ChatMessage

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_one', 'user_two', 'created_at')
    search_fields = ('user_one__phone_number', 'user_two__phone_number')

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'sender', 'is_read', 'sent_at')
    list_filter = ('is_read', 'sent_at')
    search_fields = ('sender__phone_number', 'message_content')
