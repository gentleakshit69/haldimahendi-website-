from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import ChatSession, ChatMessage

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id)
        
        # Verify user is part of the session
        if request.user != session.user_one and request.user != session.user_two:
            return Response({'error': 'You do not have permission to view this chat session.'}, status=status.HTTP_403_FORBIDDEN)
            
        messages = session.messages.order_by('sent_at')
        
        message_data = [
            {
                "id": str(msg.id),
                "sender_id": str(msg.sender.id),
                "sender_phone": msg.sender.phone_number,
                "message_content": msg.message_content,
                "sent_at": msg.sent_at.isoformat(),
                "is_read": msg.is_read
            }
            for msg in messages
        ]
        
        return Response({'messages': message_data}, status=status.HTTP_200_OK)
    except ChatSession.DoesNotExist:
        return Response({'error': 'Chat session not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_or_get_chat_session(request):
    """
    Given a target user ID, returns the existing chat session or creates a new one.
    """
    target_user_id = request.data.get('target_user_id')
    if not target_user_id:
        return Response({'error': 'target_user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    if str(request.user.id) == str(target_user_id):
        return Response({'error': 'You cannot start a chat session with yourself.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        from users.models import User
        target_user = User.objects.get(id=target_user_id)
        
        # Check if session already exists
        session = ChatSession.objects.filter(
            (Q(user_one=request.user) & Q(user_two=target_user)) |
            (Q(user_one=target_user) & Q(user_two=request.user))
        ).first()
        
        if not session:
            session = ChatSession.objects.create(user_one=request.user, user_two=target_user)
            
        return Response({
            'session_id': str(session.id),
            'target_user': {
                'id': str(target_user.id),
                'phone_number': target_user.phone_number
            }
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({'error': 'Target user not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
