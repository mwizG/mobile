# In accounts/serializers.py

from jobs.models import RatingReview
from rest_framework import serializers
from .models import CustomUser, ExperienceCategory
from django.contrib.auth import authenticate
from django.db.models import Avg

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
        fields = ('id', 'name')  # Assuming ExperienceCategory has 'id' and 'name'


class CustomUserSerializer(serializers.ModelSerializer):
    # Use a nested serializer for experience_categories
    experience_categories = ExperienceCategorySerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience_categories', 'certifications',
            'availability', 'profile_image'
        )

class UserSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()
    experience_categories = ExperienceCategorySerializer(many=True, read_only=True)  # Use nested serializer

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'experience_categories', 'certifications',
            'availability', 'profile_image', 'average_rating', 'rating_count'
        )

    def get_average_rating(self, obj):
        reviews = RatingReview.objects.filter(reviewee=obj)
        if reviews.exists():
            return reviews.aggregate(Avg('rating'))['rating__avg']
        return 0

    def get_rating_count(self, obj):
        reviews = RatingReview.objects.filter(reviewee=obj)
        return reviews.count()


class RegisterSerializer(serializers.ModelSerializer):
    location = serializers.CharField(required=False)
    bio = serializers.CharField(required=False)
    certifications = serializers.CharField(required=False)
    availability = serializers.CharField(required=False)
    profile_image = serializers.ImageField(required=False)
    payment_preference = serializers.CharField(required=False)
    experience_categories = serializers.PrimaryKeyRelatedField(
        queryset=ExperienceCategory.objects.all(),
        many=True,
        required=False
    )
    health_status = serializers.CharField(required=False)
    contact_info = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = (
            'username', 'email', 'password', 'is_care_seeker', 'is_caregiver',
            'location', 'bio', 'certifications', 'availability',
            'profile_image', 'payment_preference', 'experience_categories',
            'health_status', 'contact_info'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        experience_categories_data = validated_data.pop('experience_categories', [])

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_care_seeker=validated_data.get('is_care_seeker', False),
            is_caregiver=validated_data.get('is_caregiver', False)
        )

        if user.is_caregiver:
            user.certifications = validated_data.get('certifications', '')
            user.availability = validated_data.get('availability', '')
            user.payment_preference = validated_data.get('payment_preference', '')

        if user.is_care_seeker:
            user.health_status = validated_data.get('health_status', '')
            user.contact_info = validated_data.get('contact_info', '')

        user.location = validated_data.get('location', '')
        user.bio = validated_data.get('bio', '')
        user.profile_image = validated_data.get('profile_image', None)

        user.save()

        # Add experience categories using PrimaryKeyRelatedField
        if experience_categories_data:
            user.experience_categories.set(experience_categories_data)  # Link categories to the user

        return user
