from django.db import models
from accounts.models import CustomUser

class EmergencyService(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('ambulance', 'Ambulance'),
        ('pharmacy', 'Pharmacy'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='emergency_calls')
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    details = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.service_type} at {self.created_at}"