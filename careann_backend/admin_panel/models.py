
from django.db import models
from accounts.models import CustomUser

class SupportTicket(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets')
    issue = models.TextField()
    status = models.CharField(max_length=50, default='Open')  # Status: Open, Resolved
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket from {self.user.username} - {self.status}"