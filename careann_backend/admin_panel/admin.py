from django.contrib import admin
from django.contrib.admin import AdminSite
from django.urls import path
from django.shortcuts import render
from .models import SupportTicket

# Register SupportTicket with the custom admin site
@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'created_at']
    search_fields = ['user__username']
    list_filter = ['status']


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

