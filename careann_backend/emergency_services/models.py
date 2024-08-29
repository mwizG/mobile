from django.db import models
from accounts.models import CustomUser

class EmergencyService(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('ambulance', 'Ambulance'),
        ('fire', 'Fire'),
        ('police', 'Police'),
        ('other', 'Other'),
    ]

    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE_CHOICES)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='emergency_requests')
    location = models.CharField(max_length=255)
    details = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Pending')  # Status: Pending, In Progress, Completed, Cancelled
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service_type.capitalize()} requested by {self.requested_by.username} at {self.location}"
