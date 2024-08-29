from django.contrib import admin
from .models import Pharmacy, Medication

@admin.register(Pharmacy)
class PharmacyAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone_number', 'email', 'website')
    search_fields = ('name', 'address')

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'pharmacy', 'price', 'available_quantity')
    search_fields = ('name', 'pharmacy__name')
