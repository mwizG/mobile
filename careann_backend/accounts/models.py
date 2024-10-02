from django.contrib.auth.models import AbstractUser
from django.db import models
from django_filters import rest_framework as filters


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
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_care_seeker = models.BooleanField(default=False)
    is_caregiver = models.BooleanField(default=False)
    rating_count = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    location = models.CharField(max_length=50, choices=ZAMBIA_LOCATIONS, default='Lusaka')
    bio = models.TextField(null=True, blank=True)
   
    availability = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    payment_preference = models.CharField(max_length=20, null=True, blank=True)
    health_status = models.TextField(null=True, blank=True)
    contact_info = models.CharField(max_length=255, null=True, blank=True)

    # New fields for the three experience categories
    experience_cat1 = models.ForeignKey(ExperienceCategory, related_name='category1_users', on_delete=models.SET_NULL, null=True, blank=True)
    experience_cat2 = models.ForeignKey(ExperienceCategory, related_name='category2_users', on_delete=models.SET_NULL, null=True, blank=True)
    experience_cat3 = models.ForeignKey(ExperienceCategory, related_name='category3_users', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.email

class Certification(models.Model):
    user = models.ForeignKey(CustomUser, related_name='certifications', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='certifications/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_type = models.CharField(max_length=50)

    def __str__(self):
        return f"Certification ({self.name}) for {self.user.username}"

class CaregiverFilter(filters.FilterSet):
    care_type = filters.CharFilter(field_name="experience_categories")
    certifications = filters.CharFilter(field_name="certifications")
    location = filters.CharFilter(field_name="location")

    class Meta:
        model = CustomUser
        fields = ['care_type', 'certifications', 'location']
