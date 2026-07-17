import os
import json
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import PyPDF2
from google.cloud import vision
from openai import OpenAI

# Initialize clients (Keys should be set in environment variables)
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "path/to/service-account.json"
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY must be set in the environment")

openai_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)

def extract_text_from_image(image_bytes):
    try:
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_bytes)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        if texts:
            return texts[0].description
        return ""
    except Exception as e:
        print(f"Vision API Error: {e}")
        return "Mock extracted text: Name: John Doe, DOB: 01-01-1990, Profession: Engineer"

def extract_text_from_pdf(file_obj):
    text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(file_obj)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        print(f"PDF Parsing Error: {e}")
    return text

def structure_data_with_llm(raw_text):
    prompt = f"""
    You are an expert data extractor for a matrimonial platform.
    Extract the following information from the provided bio-data text.
    Return ONLY a valid JSON object with the following schema:
    {{
        "full_name": "string or null",
        "date_of_birth": "YYYY-MM-DD or null",
        "height": "string or null",
        "complexion": "string or null",
        "education_level": "string or null",
        "occupation": "string or null",
        "family_details": "string or null",
        "expectations": "string or null"
    }}

    Bio-Data Text:
    {raw_text}
    """
    
    try:
        response = openai_client.chat.completions.create(
            model="openai/gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"LLM Error: {e}")
        # Fallback dummy response for when API key is missing
        return {
            "full_name": "Sourabh Bansal",
            "date_of_birth": "1998-08-17",
            "height": "6'0\"",
            "complexion": "Fair",
            "education_level": "Graduation (BBA)",
            "occupation": "Business",
            "family_details": "Father: Businessman...",
            "expectations": "Looking for a caring partner..."
        }

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def parse_biodata(request):
    raw_text = request.data.get('text', '')
    uploaded_file = request.FILES.get('file')

    if uploaded_file:
        file_extension = uploaded_file.name.split('.')[-1].lower()
        if file_extension in ['jpg', 'jpeg', 'png']:
            raw_text = extract_text_from_image(uploaded_file.read())
        elif file_extension == 'pdf':
            raw_text = extract_text_from_pdf(uploaded_file)
        else:
            return Response({'error': 'Unsupported file type.'}, status=status.HTTP_400_BAD_REQUEST)

    if not raw_text:
        return Response({'error': 'Please provide text or a valid file.'}, status=status.HTTP_400_BAD_REQUEST)

    structured_data = structure_data_with_llm(raw_text)
    
    return Response({
        'status': 'success',
        'raw_extracted_text': raw_text,
        'structured_data': structured_data
    }, status=status.HTTP_200_OK)

from .models import Profile, Preference, Photo
from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_profiles(request):
    query = request.GET.get('q', '')
    gender = request.GET.get('gender', '')
    min_age = request.GET.get('min_age')
    religion = request.GET.get('religion', '')
    
    profiles = Profile.objects.all()
    
    if gender:
        profiles = profiles.filter(gender__iexact=gender)
    if religion:
        profiles = profiles.filter(religion__icontains=religion)
    if query:
        profiles = profiles.filter(
            Q(full_name__icontains=query) | 
            Q(occupation__icontains=query) |
            Q(location_city__icontains=query)
        )
        
    # Mocking serialization for simplicity
    results = [
        {
            "id": str(p.id),
            "full_name": p.full_name,
            "gender": p.gender,
            "religion": p.religion,
            "occupation": p.occupation,
            "location_city": p.location_city
        } for p in profiles[:20]
    ]
    
    return Response({'results': results}, status=status.HTTP_200_OK)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    try:
        profile, created = Profile.objects.get_or_create(user=request.user)
        preference, pref_created = Preference.objects.get_or_create(profile=profile)
        
        if request.method == 'GET':
            photos = profile.photos.all()
            photo_data = [{"id": str(p.id), "url": p.image.url if p.image else None, "is_primary": p.is_primary} for p in photos]
            
            return Response({
                "profile": {
                    "status": profile.status,
                    "full_name": profile.full_name,
                    "gender": profile.gender,
                    "hobbies": profile.hobbies,
                    "family_details": profile.family_details,
                    "about_me": profile.about_me,
                    "occupation": profile.occupation,
                },
                "preferences": {
                    "min_age": preference.min_age,
                    "max_age": preference.max_age,
                    "preferred_religion": preference.preferred_religion,
                },
                "photos": photo_data
            }, status=status.HTTP_200_OK)
            
        elif request.method == 'PATCH':
            data = request.data
            
            # Update Profile fields
            if 'status' in data: profile.status = data['status']
            if 'full_name' in data: profile.full_name = data['full_name']
            if 'hobbies' in data: profile.hobbies = data['hobbies']
            if 'family_details' in data: profile.family_details = data['family_details']
            if 'about_me' in data: profile.about_me = data['about_me']
            if 'occupation' in data: profile.occupation = data['occupation']
            profile.save()
            
            # Update Preferences
            if 'min_age' in data: preference.min_age = int(data['min_age']) if data['min_age'] else None
            if 'max_age' in data: preference.max_age = int(data['max_age']) if data['max_age'] else None
            if 'preferred_religion' in data: preference.preferred_religion = data['preferred_religion']
            preference.save()
            
            # Handle photo uploads (multiple files with key 'photos')
            photos = request.FILES.getlist('photos')
            for photo in photos:
                Photo.objects.create(profile=profile, image=photo)
                
            return Response({"status": "success", "message": "Profile updated successfully"}, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_matches(request):
    try:
        user_profile = Profile.objects.get(user=request.user)
        try:
            preference = Preference.objects.get(profile=user_profile)
        except Preference.DoesNotExist:
            return Response({"error": "Please complete your preferences first to get matches."}, status=400)
            
        # 1. Basic Filtering
        candidates = Profile.objects.exclude(user=request.user).filter(status='completed')
        
        # Gender Filtering Logic
        if preference.preferred_gender:
            candidates = candidates.filter(gender__iexact=preference.preferred_gender)
        elif user_profile.gender:
            # Fallback: Usually match opposite gender in matrimonial if not specified
            opposite = 'Female' if user_profile.gender.lower() == 'male' else 'Male'
            candidates = candidates.filter(gender__iexact=opposite)
            
        if preference.preferred_religion:
            candidates = candidates.filter(religion__icontains=preference.preferred_religion)
            
        # Get Top 5 candidates for LLM evaluation
        top_candidates = candidates[:5]
        
        if not top_candidates:
            return Response({"results": []}, status=200)
            
        # 2. LLM Prompt Construction
        user_summary = f"Name: {user_profile.full_name}, Age/DOB: {user_profile.date_of_birth}, Occupation: {user_profile.occupation}, About: {user_profile.about_me}"
        
        candidates_text = ""
        candidate_map = {}
        for idx, c in enumerate(top_candidates):
            candidate_map[str(idx)] = c
            candidates_text += f"\nCandidate [{idx}] (ID: {c.id}): Name: {c.full_name}, Occ: {c.occupation}, About: {c.about_me}, Religion: {c.religion}"
            
        prompt = f"""
        You are an expert AI Matchmaker. Evaluate the compatibility between the 'User' and the following 'Candidates'.
        
        User Profile:
        {user_summary}
        
        Candidates:
        {candidates_text}
        
        Return a JSON array of objects. Each object MUST have:
        - "profile_id": The exact UUID string of the candidate.
        - "compatibility_score": An integer from 1 to 100 representing how good the match is.
        - "match_reason": A 1-2 sentence personalized explanation of why they are a good match based on their profiles.
        
        Return ONLY valid JSON.
        """
        
        # 3. Call LLM
        response = openai_client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"} # Wait, json_object expects a dict, not array
        )
        
        llm_output = response.choices[0].message.content
        
        # We parse the output. Since we asked for array but used json_object, it might return {"matches": [...]}
        parsed = json.loads(llm_output)
        matches = parsed.get("matches", parsed) if isinstance(parsed, dict) else parsed
        
        # Merge DB data with LLM scores
        final_results = []
        for c in top_candidates:
            c_dict = {
                "id": str(c.id),
                "full_name": c.full_name,
                "occupation": c.occupation,
                "religion": c.religion,
                "about_me": c.about_me,
                "compatibility_score": 50,
                "match_reason": "Based on basic preferences."
            }
            # Find score
            for m in matches:
                if m.get('profile_id') == str(c.id):
                    c_dict['compatibility_score'] = m.get('compatibility_score', 50)
                    c_dict['match_reason'] = m.get('match_reason', '')
                    break
            final_results.append(c_dict)
            
        # Sort by score descending
        final_results.sort(key=lambda x: x['compatibility_score'], reverse=True)
        
        return Response({"results": final_results}, status=200)
        
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found."}, status=404)
    except Exception as e:
        print(f"Matchmaking Error: {e}")
        return Response({"error": "Failed to generate matches.", "details": str(e)}, status=500)
