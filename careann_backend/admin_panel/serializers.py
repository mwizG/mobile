from rest_framework import serializers
from .models import SupportTicket, Dispute, ModerationAction, UserActivity

# Updated SupportTicket serializer
class SupportTicketSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    resolved_by = serializers.ReadOnlyField(source='resolved_by.username')  # New field
    resolution_notes = serializers.CharField(allow_blank=True, required=False)  # New field

    class Meta:
        model = SupportTicket
        fields = ['id', 'user', 'issue', 'status', 'created_at', 'resolved_by', 'resolution_notes']
        read_only_fields = ['resolved_by']  # Make 'resolved_by' read-only

# Updated Dispute serializer
class DisputeSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    against_user = serializers.ReadOnlyField(source='against_user.username')
    resolved_by = serializers.ReadOnlyField(source='resolved_by.username')  # New field

    class Meta:
        model = Dispute
        fields = ['id', 'created_by', 'against_user', 'job', 'description', 'status', 'resolution', 'resolved_by', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'against_user', 'resolved_by']  # Security enforcement

# Updated ModerationAction serializer
class ModerationActionSerializer(serializers.ModelSerializer):
    moderator = serializers.ReadOnlyField(source='moderator.username')
    target_user = serializers.ReadOnlyField(source='job.user.username')  # Assuming 'job' has a foreign key to user

    class Meta:
        model = ModerationAction
        fields = ['id', 'moderator', 'action_type', 'job', 'review', 'target_user', 'reason', 'created_at']

# Updated UserActivity serializer
class UserActivitySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'action', 'timestamp', 'description']  # Adding description if it exists
