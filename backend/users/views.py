import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings
from .models import User, OTPVerification
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
import requests
import logging

logger = logging.getLogger(__name__)

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
    
    # Create new OTP (hashed)
    OTPVerification.objects.create(user=user, otp_hash=make_password(otp_code))
    
    # Prepare SMS API payload
    msg_template = f"Dear Member, Your client login account OTP is {otp_code} It will expire in Five minutes. Do not share it with anyone. Thanks, -Webczar"
    
    # Local Testing Bypass
    if phone_number.startswith("+919999999") or phone_number == "+910000000000":
        logger.info(f"MOCK OTP generated for {phone_number}: {otp_code}")
        print(f"\n[LOCAL TEST] MOCK OTP for {phone_number}: {otp_code}\n")
        return Response({'status': 'OTP sent successfully (Mocked).', 'mock_otp': otp_code}, status=status.HTTP_200_OK)

    params = {
        'key': settings.SMS_API_KEY,
        'campaign': settings.SMS_API_CAMPAIGN,
        'routeid': settings.SMS_API_ROUTE_ID,
        'type': 'text',
        'contacts': phone_number,
        'senderid': settings.SMS_API_SENDER_ID,
        'msg': msg_template,
        'template_id': settings.SMS_API_TEMPLATE_ID,
        'pe_id': settings.SMS_API_PE_ID
    }

    try:
        response = requests.get(settings.SMS_API_URL, params=params, timeout=10)
        response.raise_for_status()
        # Optionally, check response.text if the provider returns 200 but has a logic error in text.
        logger.info(f"Successfully sent OTP to {phone_number}. SMS provider response: {response.text}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send OTP to {phone_number}. Error: {str(e)}")
        # Return 500 error per design
        return Response(
            {'error': 'Failed to send SMS OTP. Please try again later.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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
            is_used=False,
            expires_at__gt=timezone.now()
        ).order_by('-expires_at').first()
        
        if not otp_record or not check_password(otp_code, otp_record.otp_hash):
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
