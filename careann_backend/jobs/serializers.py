# In jobs/serializers.py

from rest_framework import serializers
from .models import Job
from .models import JobApplication
from .models import RatingReview

class RatingReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source='reviewer.username')
    reviewee = serializers.ReadOnlyField(source='reviewee.username')

    class Meta:
        model = RatingReview
        fields = ('id', 'job', 'reviewer', 'reviewee', 'rating', 'review', 'created_at')

class JobApplicationSerializer(serializers.ModelSerializer):
    caregiver = serializers.ReadOnlyField(source='caregiver.username')

    class Meta:
        model = JobApplication
        fields = ('id', 'job', 'caregiver', 'cover_letter', 'applied_at', 'status')

class JobSerializer(serializers.ModelSerializer):
    care_seeker = serializers.ReadOnlyField(source='care_seeker.username')

    class Meta:
        model = Job
        fields = ('id', 'care_seeker', 'title', 'description', 'location', 'job_type', 'pay_rate', 'created_at', 'updated_at')
