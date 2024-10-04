# In jobs/models.py
from django.db import models
from accounts.models import CustomUser, ExperienceCategory



ZAMBIA_LOCATIONS = [
    ('Lusaka', 'Lusaka'),
    ('Ndola', 'Ndola'),
    ('Kitwe', 'Kitwe'),
    ('Livingstone', 'Livingstone'),
    ('Chipata', 'Chipata'),
    ('Mansa', 'Mansa'),
    ('Kabwe', 'Kabwe'),
    ('Solwezi', 'Solwezi'),
    # Add more cities or regions as needed
]


class Job(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Declined', 'Declined'),
        ('Deleted', 'Deleted'),  # New status to mark job as deleted
    ]

    care_seeker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='jobs')
    caregiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='assigned_jobs', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=50, choices=ZAMBIA_LOCATIONS, default='Lusaka')
    
    # Importing JOB_TYPE_CHOICES from ExperienceCategory
    job_type = models.CharField(max_length=100, choices=ExperienceCategory.JOB_TYPE_CHOICES)
    
    pay_rate = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Open')
    scheduled_time = models.DateTimeField(null=True, blank=True)  # Time for the job
    proposed_time = models.DateTimeField(null=True, blank=True)  # Time proposed by care seeker
    accepted_time = models.DateTimeField(null=True, blank=True)  # Time accepted by caregiver
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        # Add custom permissions for admins
        permissions = [
            ("view_deleted_job", "Can view deleted job"),
        ]


    

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
          # New status to mark job as deleted
    ]
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    caregiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    cover_letter = models.TextField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')  # Status: Pending, Accepted, Rejected

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


class Task(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='tasks')
    caregiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tasks')
    description = models.TextField()
    scheduled_time = models.DateTimeField()  # When the task is supposed to be done
    reminder_sent = models.BooleanField(default=False)  # Track if a reminder has been sent
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # Add status field

    def __str__(self):
        return f"Task for {self.caregiver.username} - {self.job.title} at {self.scheduled_time}"
