from django.contrib import admin
from .models import Job,JobApplication, RatingReview
# Register your models here
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'care_seeker', 'status', 'created_at']
    search_fields = ['title', 'care_seeker__username']
    list_filter = ['status']


@admin.register(RatingReview)
class RatingReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer', 'reviewee', 'rating', 'created_at']
    search_fields = ['reviewer__username', 'reviewee__username']