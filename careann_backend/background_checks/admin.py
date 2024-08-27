from django.contrib import admin
from . models import BackgroundCheck

@admin.register(BackgroundCheck)
class BackgroundCheckAdmin(admin.ModelAdmin):
    list_display = ['user', 'checkr_id', 'status', 'created_at']
    search_fields = ['user__username', 'checkr_id']
    list_filter = ['status']