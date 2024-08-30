from rest_framework import serializers
from .models import Job
from .models import JobApplication
from .models import RatingReview, Task

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
        extra_kwargs = {
            'job': {'required': False},  # Make 'job' not required in the incoming data
        }

    def create(self, validated_data):
        # Remove the job from validated_data because it's being passed explicitly
        job = self.context['job']
        caregiver = self.context['request'].user
        validated_data['job'] = job
        validated_data['caregiver'] = caregiver
        return super().create(validated_data)


class JobSerializer(serializers.ModelSerializer):
    care_seeker = serializers.ReadOnlyField(source='care_seeker.username')
    caregiver = serializers.ReadOnlyField(source='caregiver.username')  # Added to include caregiver's username

    class Meta:
        model = Job
        fields = (
            'id', 'care_seeker', 'caregiver', 'title', 'description', 
            'location', 'job_type', 'pay_rate', 'status', 'scheduled_time', 
            'proposed_time', 'accepted_time', 'created_at', 'updated_at'
        )
        
class TaskSerializer(serializers.ModelSerializer):
    caregiver = serializers.ReadOnlyField(source='caregiver.username')

    class Meta:
        model = Task
        fields = ('id', 'job', 'caregiver', 'description', 'scheduled_time', 'reminder_sent')