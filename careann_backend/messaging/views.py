from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from . import serializers
from accounts.models import CustomUser
from accounts.serializers import UserSerializer  # Assuming this exists to serialize users

class CaregiverListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(is_caregiver=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ConversationListView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only conversations where the user is a participant
        return self.request.user.conversations.all()

    def perform_create(self, serializer):
        participants = self.request.data.get('participants')
        if not participants:
            return Response({"error": "Participants are required."}, status=400)

        # Find an existing conversation between the user and the participants
        existing_conversation = Conversation.objects.filter(participants=self.request.user)\
            .filter(participants__username__in=participants).distinct()

        if existing_conversation.exists():
            # Return the existing conversation instead of creating a new one
            return existing_conversation.first()

        # If no conversation exists, create a new one
        conversation = serializer.save()
        conversation.participants.add(self.request.user, *CustomUser.objects.filter(username__in=participants))
        return conversation


class MessageListView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        conversation = Conversation.objects.get(id=conversation_id)

        # Ensure the user is a participant in the conversation
        if self.request.user not in conversation.participants.all():
            return Message.objects.none()

        # Return all messages in the conversation
        return conversation.messages.all()

    def perform_create(self, serializer):
        # Get the conversation from the URL
        conversation_id = self.kwargs['conversation_id']
        conversation = Conversation.objects.get(id=conversation_id)

        # Ensure the user is a participant in the conversation
        if self.request.user not in conversation.participants.all():
            raise serializers.ValidationError({"detail": "You are not a participant in this conversation."})

        # Save the message with the conversation and sender
        serializer.save(conversation=conversation, sender=self.request.user)
