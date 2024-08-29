from rest_framework import serializers
from .models import Pharmacy, Medication

class PharmacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pharmacy
        fields = ('id', 'name', 'address', 'phone_number', 'email', 'website', 'opening_hours')

class MedicationSerializer(serializers.ModelSerializer):
    pharmacy = serializers.ReadOnlyField(source='pharmacy.name')

    class Meta:
        model = Medication
        fields = ('id', 'pharmacy', 'name', 'description', 'price', 'available_quantity')
