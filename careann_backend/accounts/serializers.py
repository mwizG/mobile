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
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'is_care_seeker', 'is_caregiver')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_care_seeker=validated_data.get('is_care_seeker', False),
            is_caregiver=validated_data.get('is_caregiver', False)
        )
        return user

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
        fields = ('id', 'username', 'email', 'is_care_seeker', 'is_caregiver', 
                  'location', 'bio', 'experience', 'certifications', 
                  'availability', 'profile_image', 'background_check_status')

    def get_background_check_status(self, obj):
        # Get the most recent background check status
        check = obj.background_checks.order_by('-created_at').first()
        return check.status if check else 'No background check'