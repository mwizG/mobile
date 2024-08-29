from django.db import models
from accounts.models import CustomUser
from jobs.models import Job

class Payment(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    care_seeker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments_made')
    caregiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments_received')
    stripe_charge_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, default='Pending', choices=[
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment from {self.care_seeker.username} to {self.caregiver.username} for {self.amount}"

class Subscription(models.Model):
    PLAN_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    caregiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='subscriptions')
    plan_type = models.CharField(max_length=10, choices=PLAN_CHOICES)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, default='active', choices=[
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired')
    ])

    def __str__(self):
        return f"{self.caregiver.username} - {self.plan_type} ({self.status})"
