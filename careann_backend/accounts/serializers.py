from jobs.models import RatingReview
from rest_framework import serializers
from .models import CustomUser, ExperienceCategory
from django.contrib.auth import authenticate
from django.db.models import Avg
from collections import OrderedDict 


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}  # Return a dictionary with 'user' as the key
        raise serializers.ValidationError("Invalid Credentials")


class ExperienceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceCategory
        fields = ('id', 'name')

class CustomUserSerializer(serializers.ModelSerializer):
    # Assuming you want this for other purposes, keep it as it is.
    experience_cat1 = ExperienceCategorySerializer(read_only=True)
    experience_cat2 = ExperienceCategorySerializer(read_only=True)
    experience_cat3 = ExperienceCategorySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience_cat1', 'experience_cat2', 'experience_cat3',
            'certifications', 'availability', 'profile_image'
        )

class RegisterSerializer(serializers.ModelSerializer):
    location = serializers.CharField(required=False)
    bio = serializers.CharField(required=False)
    certifications = serializers.CharField(required=False)
    availability = serializers.CharField(required=False)
    profile_image = serializers.ImageField(required=False)
    payment_preference = serializers.CharField(required=False)
    
    # Use PrimaryKeyRelatedField for each of the three experience categories
    experience_cat1 = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(), required=False
    )
    experience_cat2 = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(), required=False
    )
    experience_cat3 = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(), required=False
    )
    health_status = serializers.CharField(required=False)
    contact_info = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = (
            'username', 'email', 'password', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'certifications', 'availability',
            'profile_image', 'payment_preference', 'experience_cat1',
            'experience_cat2', 'experience_cat3', 'health_status', 'contact_info'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create the user instance
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_care_seeker=validated_data.get('is_care_seeker', False),
            is_caregiver=validated_data.get('is_caregiver', False)
        )

        # Set additional caregiver-specific fields if applicable
        if user.is_caregiver:
            user.certifications = validated_data.get('certifications', '')
            user.availability = validated_data.get('availability', '')
            user.payment_preference = validated_data.get('payment_preference', '')

        # Set additional care seeker-specific fields if applicable
        if user.is_care_seeker:
            user.health_status = validated_data.get('health_status', '')

        # Set general fields that apply to all user types
        user.contact_info = validated_data.get('contact_info', '')
        user.location = validated_data.get('location', '')
        user.bio = validated_data.get('bio', '')
        user.profile_image = validated_data.get('profile_image', None)

        # Set experience categories if provided
        user.experience_cat1 = validated_data.get('experience_cat1', None)
        user.experience_cat2 = validated_data.get('experience_cat2', None)
        user.experience_cat3 = validated_data.get('experience_cat3', None)

        # Save the user instance
        user.save()

        return user
