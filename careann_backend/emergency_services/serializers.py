from rest_framework import serializers
from .models import EmergencyService

class EmergencyServiceSerializer(serializers.ModelSerializer):
    requested_by = serializers.ReadOnlyField(source='requested_by.username')

    class Meta:
        model = EmergencyService
        fields = ('id', 'service_type', 'requested_by', 'location', 'details', 'status', 'created_at')