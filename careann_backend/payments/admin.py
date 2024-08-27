from django.contrib import admin
from.models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['job', 'care_seeker', 'caregiver', 'amount', 'status', 'created_at']
    search_fields = ['care_seeker__username', 'caregiver__username']
    list_filter = ['status']