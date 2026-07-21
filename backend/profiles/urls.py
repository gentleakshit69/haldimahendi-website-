from django.urls import path
from .views import parse_biodata, search_profiles, my_profile, recommended_matches, upload_biodata_async

urlpatterns = [
    path('profile/biodata/parse/', parse_biodata, name='parse_biodata'),
    path('profile/biodata/upload/', upload_biodata_async, name='upload_biodata_async'),
    path('profile/me/', my_profile, name='my_profile'),
    path('matches/search/', search_profiles, name='search_profiles'),
    path('matches/recommended/', recommended_matches, name='recommended_matches'),
]
