# In messaging/serializers.py
from accounts.models import CustomUser
from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'content', 'created_at', 'read')

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.SlugRelatedField(slug_field='username', queryset=CustomUser.objects.all(), many=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ('id', 'participants', 'messages', 'created_at', 'updated_at')
