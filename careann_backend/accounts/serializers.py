# In accounts/serializers.py

from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience', 'certifications', 'availability', 'profile_image'
        )

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}  # Return a dictionary with 'user' as the key
        raise serializers.ValidationError("Invalid Credentials")
    

class UserSerializer(serializers.ModelSerializer):
    background_check_status = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience', 'certifications', 
            'availability', 'profile_image', 'background_check_status', 
            'payment_preference', 'experience_categories', 'health_status', 'contact_info'
        )

    def get_background_check_status(self, obj):
        check = obj.background_checks.order_by('-created_at').first()
        return check.status if check else 'No background check'


class RegisterSerializer(serializers.ModelSerializer):
    location = serializers.CharField(required=False)
    bio = serializers.CharField(required=False)
    experience = serializers.CharField(required=False)
    certifications = serializers.CharField(required=False)
    availability = serializers.CharField(required=False)
    profile_image = serializers.ImageField(required=False)
    payment_preference = serializers.CharField(required=False)
    experience_categories = serializers.CharField(required=False)
    health_status = serializers.CharField(required=False)
    contact_info = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = (
            'username', 'email', 'password', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience', 'certifications', 'availability', 
            'profile_image', 'payment_preference', 'experience_categories', 
            'health_status', 'contact_info'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_care_seeker=validated_data.get('is_care_seeker', False),
            is_caregiver=validated_data.get('is_caregiver', False)
        )

        if user.is_caregiver:
            user.experience = validated_data.get('experience', '')
            user.certifications = validated_data.get('certifications', '')
            user.availability = validated_data.get('availability', '')
            user.payment_preference = validated_data.get('payment_preference', '')
            user.experience_categories = validated_data.get('experience_categories', '')

        if user.is_care_seeker:
            user.health_status = validated_data.get('health_status', '')
            user.contact_info = validated_data.get('contact_info', '')

        user.location = validated_data.get('location', '')
        user.bio = validated_data.get('bio', '')
        user.profile_image = validated_data.get('profile_image', None)

        user.save()
        return user