from django.contrib.auth.models import AbstractUser
from django.db import models
from django_filters import rest_framework as filters

class ExperienceCategory(models.Model):
    JOB_TYPE_CHOICES = [
        ('Respite Care', 'Respite Care'),
        ('Home Care', 'Home Care'),
        ('Senior Care', 'Senior Care'),
        ('Child Care', 'Child Care'),
        ('Disability Care', 'Disability Care'),
        ('Palliative Care', 'Palliative Care'),
        ('Post-Surgical Care', 'Post-Surgical Care'),
        ('Maternity Care', 'Maternity Care'),
        ('Dementia Care', 'Dementia Care'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES)  # Add job_type field with choices

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_care_seeker = models.BooleanField(default=False)
    is_caregiver = models.BooleanField(default=False)
    rating_count = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    location = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    certifications = models.TextField(null=True, blank=True)  # Caregiver-specific
    availability = models.CharField(max_length=255, null=True, blank=True)  # Caregiver-specific
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    payment_preference = models.CharField(max_length=20, null=True, blank=True)
    health_status = models.TextField(null=True, blank=True)
    contact_info = models.CharField(max_length=255, null=True, blank=True)

    # Changed this field to ManyToManyField for multiple selections
    experience_categories = models.ManyToManyField(ExperienceCategory, blank=True)

    def __str__(self):
        return self.email

class CaregiverFilter(filters.FilterSet):
    care_type = filters.CharFilter(field_name="experience_categories")
    certifications = filters.CharFilter(field_name="certifications")
    location = filters.CharFilter(field_name="location")

    class Meta:
        model = CustomUser
        fields = ['care_type', 'certifications', 'location']
