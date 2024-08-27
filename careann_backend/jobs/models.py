# In jobs/models.py

from django.db import models
from accounts.models import CustomUser

class Job(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    
    care_seeker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=100)
    pay_rate = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Open')  # Track job status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    caregiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    cover_letter = models.TextField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')  # Status: Pending, Accepted, Rejected

    def __str__(self):
        return f"{self.caregiver.username} - {self.job.title}"
    

class RatingReview(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='rating_review')
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.IntegerField()  # Rating out of 5
    review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer.username} -> {self.reviewee.username} ({self.rating})"


