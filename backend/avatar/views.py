from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
import logging

from .services import generate_avatar_session, validate_webhook_signature

logger = logging.getLogger(__name__)

class AvatarSessionCreateView(APIView):
    """
    Endpoint for the frontend to request a new avatar session.
    It returns a session token from the third-party service.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            # Generate the token using the service layer
            session_token = generate_avatar_session(user)
            return Response(
                {"session_token": session_token}, 
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error generating avatar session for user {user.id}: {e}")
            return Response(
                {"error": "Failed to generate avatar session."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AvatarWebhookView(APIView):
    """
    Webhook endpoint for the third-party AI Avatar service to send 
    the final extracted bio data.
    """
    # Note: Webhooks usually come from unauthenticated external servers, 
    # so we rely on signature validation instead of IsAuthenticated.
    permission_classes = [] 

    def post(self, request):
        # 1. Validate the webhook signature
        if not validate_webhook_signature(request):
            return Response(
                {"error": "Invalid signature"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data
        
        # Example payload structure (varies by provider)
        # {
        #    "user_id": 1,
        #    "extracted_data": {
        #        "bio": "I love hiking and reading...",
        #        "hobbies": ["hiking", "reading"]
        #    }
        # }
        
        user_id = data.get("user_id")
        extracted_data = data.get("extracted_data", {})
        
        if not user_id:
            return Response(
                {"error": "Missing user_id in payload"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # 2. Update the user profile (assume Profile model exists)
            # from profiles.models import Profile
            # profile = Profile.objects.get(user_id=user_id)
            # profile.bio = extracted_data.get("bio", profile.bio)
            # profile.save()
            
            # 3. Trigger WebSocket message to notify frontend
            channel_layer = get_channel_layer()
            group_name = f"user_{user_id}"
            
            # Send message to group
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    "type": "profile_updated",
                    "payload": {
                        "status": "success",
                        "message": "Avatar session completed and profile updated.",
                        "data": extracted_data
                    }
                }
            )
            
            return Response({"status": "success"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error processing webhook for user {user_id}: {e}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
