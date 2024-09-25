from django.contrib.auth.models import AbstractUser
from django.db import models
from django_filters import rest_framework as filters


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_care_seeker = models.BooleanField(default=False)
    is_caregiver = models.BooleanField(default=False)
    rating_count = models.PositiveIntegerField(default=0)  # Number of ratings
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)  # Average rating

    location = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    experience = models.TextField(null=True, blank=True)  # Caregiver-specific
    certifications = models.TextField(null=True, blank=True)  # Caregiver-specific
    availability = models.CharField(max_length=255, null=True, blank=True)  # Caregiver-specific
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    payment_preference = models.CharField(max_length=20, null=True, blank=True)  # Subscription or Freelance
    experience_categories = models.CharField(max_length=255, null=True, blank=True)  # Categories like respite care, home care
    health_status = models.TextField(null=True, blank=True)  # Care Seeker-specific
    contact_info = models.CharField(max_length=255, null=True, blank=True)  # Care Seeker-specific, contact information
    
    def __str__(self):
        return self.email


class CaregiverFilter(filters.FilterSet):
    care_type = filters.CharFilter(field_name="experience_categories")
    certifications = filters.CharFilter(field_name="certifications")
    location = filters.CharFilter(field_name="location")

    class Meta:
        model = CustomUser
        fields = ['care_type', 'certifications', 'location']