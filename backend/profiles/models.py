import uuid
from django.db import models
from django.conf import settings

class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=50, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    marital_status = models.CharField(max_length=50, blank=True, null=True)
    religion = models.CharField(max_length=100, blank=True, null=True)
    caste_community = models.CharField(max_length=100, blank=True, null=True)
    mother_tongue = models.CharField(max_length=100, blank=True, null=True)
    height = models.CharField(max_length=20, blank=True, null=True)
    complexion = models.CharField(max_length=50, blank=True, null=True)
    about_me = models.TextField(blank=True, null=True)
    education_level = models.CharField(max_length=150, blank=True, null=True)
    occupation = models.CharField(max_length=150, blank=True, null=True)
    income_bracket = models.CharField(max_length=100, blank=True, null=True)
    location_city = models.CharField(max_length=100, blank=True, null=True)
    location_country = models.CharField(max_length=100, blank=True, null=True)
    hobbies = models.TextField(blank=True, null=True)
    family_details = models.TextField(blank=True, null=True)
    raw_biodata_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.phone_number}"

class Preference(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='preference')
    min_age = models.IntegerField(blank=True, null=True)
    max_age = models.IntegerField(blank=True, null=True)
    preferred_religion = models.CharField(max_length=100, blank=True, null=True)
    preferred_caste = models.CharField(max_length=100, blank=True, null=True)
    preferred_location = models.CharField(max_length=255, blank=True, null=True)
    preferred_education = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return f"Preferences for {self.profile}"

class Photo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='profile_photos/')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.profile}"
