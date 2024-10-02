from jobs.models import RatingReview
from rest_framework import serializers
from .models import CustomUser, ExperienceCategory,Certification
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

class CredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'name', 'file', 'uploaded_at'] 


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'name', 'file', 'uploaded_at']

    def validate_file(self, value):
        if not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF file are allowed.")
        return value

class ExperienceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceCategory
        fields = ('id', 'name')

class CustomUserSerializer(serializers.ModelSerializer):
    # Use a nested serializer for experience_categories
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


class UserSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()

    experience_cat1 = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(), required=False
    )
    experience_cat2 = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(), required=False
    )
    experience_cat3 = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(), required=False
    )

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience_cat1', 'experience_cat2', 'experience_cat3',
            'certifications', 'availability', 'profile_image', 'average_rating',
            'rating_count', 'health_status', 'contact_info'
        )

    def get_average_rating(self, obj):
        reviews = RatingReview.objects.filter(reviewee=obj)
        return reviews.aggregate(Avg('rating'))['rating__avg'] if reviews.exists() else 0

    def get_rating_count(self, obj):
        return RatingReview.objects.filter(reviewee=obj).count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Adjust how you access experience categories
        representation['experience_cat1'] = OrderedDict({
            'id': instance.experience_cat1.id,
            'name': instance.experience_cat1.name
        }) if instance.experience_cat1 else None
        
        representation['experience_cat2'] = OrderedDict({
            'id': instance.experience_cat2.id,
            'name': instance.experience_cat2.name
        }) if instance.experience_cat2 else None
        
        representation['experience_cat3'] = OrderedDict({
            'id': instance.experience_cat3.id,
            'name': instance.experience_cat3.name
        }) if instance.experience_cat3 else None
        
        return representation

    def update(self, instance, validated_data):
        # Retain existing values for is_caregiver and is_care_seeker
        is_caregiver = validated_data.pop('is_caregiver', instance.is_caregiver)
        is_care_seeker = validated_data.pop('is_care_seeker', instance.is_care_seeker)

        # Only update profile_image if it is present in validated_data
        if 'profile_image' in validated_data:
            instance.profile_image = validated_data.pop('profile_image')

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Set caregiver and seeker status
        instance.is_caregiver = is_caregiver
        instance.is_care_seeker = is_care_seeker

        instance.save()
        return instance



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
