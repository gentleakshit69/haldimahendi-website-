import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import User, OTPVerification
from rest_framework_simplejwt.tokens import RefreshToken

def generate_otp():
    return str(random.randint(100000, 999999))

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    phone_number = request.data.get('phone_number')
    if not phone_number:
        return Response({'error': 'Phone number is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # In a real scenario, integrate Twilio/SNS here
    
    user, created = User.objects.get_or_create(phone_number=phone_number)
    otp_code = generate_otp()
    
    # Invalidate old OTPs
    OTPVerification.objects.filter(user=user, is_used=False).update(is_used=True)
    
    # Create new OTP
    OTPVerification.objects.create(user=user, otp_code=otp_code)
    
    # Dummy print to simulate sending SMS
    print(f"--- MOCK SMS --- Sent OTP {otp_code} to {phone_number}")

    return Response({'status': 'OTP sent successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone_number = request.data.get('phone_number')
    otp_code = request.data.get('otp')
    
    if not phone_number or not otp_code:
        return Response({'error': 'Phone number and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = User.objects.get(phone_number=phone_number)
        otp_record = OTPVerification.objects.filter(
            user=user, 
            otp_code=otp_code, 
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()
        
        if not otp_record:
            return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Mark as used
        otp_record.is_used = True
        otp_record.save()
        
        # Verify user
        if not user.is_verified:
            user.is_verified = True
            user.save()
            
        # Generate JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'is_new_user': not hasattr(user, 'profile')
        })
        
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
