from django.contrib import admin
from .models import Job,JobApplication, RatingReview,Task
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



@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['job', 'caregiver', 'description', 'scheduled_time', 'reminder_sent']
    list_filter = ['scheduled_time', 'reminder_sent']
    search_fields = ['job__title', 'caregiver__username', 'description']
    ordering = ['scheduled_time']

    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Job Title'

admin.site.register(JobApplication)