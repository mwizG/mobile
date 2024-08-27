
from django.db import models
from accounts.models import CustomUser

class BackgroundCheck(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='background_checks')
    checkr_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50, default='Pending')  # Status: Pending, Completed, Failed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Background check for {self.user.username} - {self.status}"
