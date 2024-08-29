from rest_framework import serializers
from .models import SupportTicket, Dispute, ModerationAction, UserActivity

# Existing SupportTicket serializer
class SupportTicketSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SupportTicket
        fields = ['id', 'user', 'issue', 'status', 'created_at']

# New Dispute serializer
class DisputeSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    against_user = serializers.ReadOnlyField(source='against_user.username')

    class Meta:
        model = Dispute
        fields = ['id', 'created_by', 'against_user', 'job', 'description', 'status', 'resolution', 'created_at', 'updated_at']

# New ModerationAction serializer
class ModerationActionSerializer(serializers.ModelSerializer):
    moderator = serializers.ReadOnlyField(source='moderator.username')

    class Meta:
        model = ModerationAction
        fields = ['id', 'moderator', 'action_type', 'job', 'review', 'reason', 'created_at']

# New UserActivity serializer
class UserActivitySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'action', 'timestamp']
