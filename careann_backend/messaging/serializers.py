from rest_framework import serializers
from accounts.models import CustomUser
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'content', 'created_at', 'read')
        read_only_fields = ('id', 'conversation', 'created_at', 'read')  # Mark fields as read-only


class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.SlugRelatedField(
        slug_field='username', 
        queryset=CustomUser.objects.all(), 
        many=True
    )
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ('id', 'participants', 'messages', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')  # Make timestamps read-only
