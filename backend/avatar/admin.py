from django.contrib import admin
from .models import AIOnboardingSession

@admin.register(AIOnboardingSession)
class AIOnboardingSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_completed', 'started_at', 'last_interaction')
    list_filter = ('is_completed', 'started_at')
    search_fields = ('user__phone_number',)
