from django.contrib import admin
from .models import Payment, Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['caregiver', 'plan_type', 'status', 'start_date', 'end_date']
    search_fields = ['caregiver__username', 'plan_type']
    list_filter = ['plan_type', 'status']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['job', 'care_seeker', 'caregiver', 'amount', 'status', 'created_at']
    search_fields = ['care_seeker__username', 'caregiver__username']
    list_filter = ['status', 'created_at']
