from django.contrib import admin
from django.contrib.admin import AdminSite
from django.urls import path
from django.shortcuts import render
from .models import SupportTicket, Dispute, ModerationAction, UserActivity

# Registering SupportTicket model
@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['user', 'issue', 'status', 'created_at']
    search_fields = ['user__username', 'issue']
    list_filter = ['status', 'created_at']

# Registering Dispute model
@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ['created_by', 'against_user', 'job', 'status', 'created_at']
    search_fields = ['created_by__username', 'against_user__username', 'description']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_by', 'against_user', 'job', 'description', 'created_at', 'updated_at']

# Registering ModerationAction model
@admin.register(ModerationAction)
class ModerationActionAdmin(admin.ModelAdmin):
    list_display = ['moderator', 'action_type', 'job', 'review', 'created_at']
    search_fields = ['moderator__username', 'reason']
    list_filter = ['action_type', 'created_at']
    readonly_fields = ['moderator', 'action_type', 'job', 'review', 'created_at']


# Registering UserActivity model
@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp']
    search_fields = ['user__username', 'action']
    list_filter = ['action', 'timestamp']
    readonly_fields = ['user', 'action', 'timestamp']



class CustomAdminSite(AdminSite):
    site_header = "CareAnn Admin"
    site_title = "CareAnn Admin Portal"
    index_title = "Welcome to CareAnn Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('analytics/', self.admin_view(self.analytics_view), name='analytics'),
        ]
        return custom_urls + urls

    def analytics_view(self, request):
        # Custom view logic for analytics
        return render(request, 'admin/analytics.html')

admin_site = CustomAdminSite(name='custom_admin')

