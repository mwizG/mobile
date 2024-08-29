from rest_framework import serializers
from .models import Payment,Subscription

class PaymentSerializer(serializers.ModelSerializer):
    care_seeker = serializers.ReadOnlyField(source='care_seeker.username')
    caregiver = serializers.ReadOnlyField(source='caregiver.username')

    class Meta:
        model = Payment
        fields = ('id', 'job', 'amount', 'care_seeker', 'caregiver', 'stripe_charge_id', 'status', 'created_at', 'updated_at')

class SubscriptionSerializer(serializers.ModelSerializer):
    caregiver = serializers.ReadOnlyField(source='caregiver.username')

    class Meta:
        model = Subscription
        fields = ('id', 'caregiver', 'plan_type', 'start_date', 'end_date', 'status')