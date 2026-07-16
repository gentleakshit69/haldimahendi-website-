from django.contrib import admin
from .models import User, OTPVerification

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'get_profile_name', 'is_verified', 'is_active', 'created_at')
    list_filter = ('is_verified', 'is_active', 'is_premium')
    search_fields = ('phone_number',)

    def get_profile_name(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.full_name
        return "No Profile"
    get_profile_name.short_description = 'Profile Name'

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_used', 'expires_at')
    list_filter = ('is_used', 'expires_at')
    search_fields = ('user__phone_number',)
