from django.urls import path
from .views import parse_biodata, search_profiles, my_profile

urlpatterns = [
    path('profile/biodata/parse/', parse_biodata, name='parse_biodata'),
    path('profile/me/', my_profile, name='my_profile'),
    path('matches/search/', search_profiles, name='search_profiles'),
]
