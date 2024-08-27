# In background_checks/serializers.py

from rest_framework import serializers
from .models import BackgroundCheck

class BackgroundCheckSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = BackgroundCheck
        fields = ('id', 'user', 'checkr_id', 'status', 'created_at', 'updated_at')
