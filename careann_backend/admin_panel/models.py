from django.db import models
from accounts.models import CustomUser
from jobs.models import Job, RatingReview

# Updated SupportTicket model
class SupportTicket(models.Model):
    status_type=[
        ('Open','Open'),
        ('Closed','Closed'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets')
    issue = models.TextField()
    status = models.CharField(max_length=50, choices=status_type, default='Open')
  # Status: Open, Resolved
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_tickets')  # New field
    resolution_notes = models.TextField(null=True, blank=True)  # New field

    def __str__(self):
        return f"Ticket from {self.user.username} - {self.status}"

# Updated Dispute model
class Dispute(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Resolved', 'Resolved'),
        ('Escalated', 'Escalated'),
    ]
    
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='disputes_created')
    against_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='disputes_against')
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name='disputes')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    resolution = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_disputes')  # New field
    assigned_moderator = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_disputes')  # New field

    def __str__(self):
        return f"Dispute by {self.created_by.username} against {self.against_user.username}"

# New ModerationAction model
class ModerationAction(models.Model):
    ACTION_CHOICES = [
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Flagged', 'Flagged'),
    ]

    moderator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='moderation_actions')
    action_type = models.CharField(max_length=50, choices=ACTION_CHOICES)
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    review = models.ForeignKey(RatingReview, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.moderator.username} - {self.action_type}"

# New UserActivity model
class UserActivity(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"
