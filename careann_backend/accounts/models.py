
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_care_seeker = models.BooleanField(default=False)
    is_caregiver = models.BooleanField(default=False)
    # Additional fields for both care seekers and caregivers
    location = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    experience = models.TextField(null=True, blank=True)
    certifications = models.TextField(null=True, blank=True)
    availability = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return self.email