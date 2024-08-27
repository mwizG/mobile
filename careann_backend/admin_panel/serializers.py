# In admin_panel/serializers.py

from rest_framework import serializers
from .models import SupportTicket

class SupportTicketSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # Display the username of the user

    class Meta:
        model = SupportTicket
        fields = ('id', 'user', 'issue', 'status', 'created_at')
        read_only_fields = ('created_at', 'status')
