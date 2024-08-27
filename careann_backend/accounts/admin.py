
from django.contrib import admin
from .models import CustomUser

# Check if the model is already registered
if not admin.site.is_registered(CustomUser):
    @admin.register(CustomUser)
    class CustomUserAdmin(admin.ModelAdmin):
        list_display = ['username', 'email', 'is_care_seeker', 'is_caregiver', 'is_active']
        search_fields = ['username', 'email']
        list_filter = ['is_care_seeker', 'is_caregiver', 'is_active']
