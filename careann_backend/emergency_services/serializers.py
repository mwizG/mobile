from rest_framework import serializers
from .models import EmergencyService

class EmergencyServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyService
        fields = ['id', 'user', 'service_type', 'details', 'created_at']
