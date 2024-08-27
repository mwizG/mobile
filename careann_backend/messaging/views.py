from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from . import serializers
class ConversationListView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return conversations the user is a participant in
        return self.request.user.conversations.all()

    def perform_create(self, serializer):
        conversation = serializer.save()
        conversation.participants.add(self.request.user)

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

        # Mark messages as read when retrieved
        messages = conversation.messages.filter(sender__ne=self.request.user)
        messages.update(read=True)

        return conversation.messages.all()