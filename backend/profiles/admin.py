from django.contrib import admin
from .models import Profile, Preference, Photo

class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1

class PreferenceInline(admin.StackedInline):
    model = Preference
    extra = 0

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'gender', 'occupation')
    list_filter = ('gender',)
    search_fields = ('full_name', 'user__phone_number')
    inlines = [PreferenceInline, PhotoInline]

@admin.register(Preference)
class PreferenceAdmin(admin.ModelAdmin):
    list_display = ('profile', 'min_age', 'max_age', 'preferred_religion')

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('profile', 'is_primary')
