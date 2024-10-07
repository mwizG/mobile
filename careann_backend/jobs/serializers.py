
from rest_framework import serializers
from .models import Job
from .models import JobApplication
from .models import RatingReview, Task
from accounts.models import CustomUser
from django.utils import timezone  # Ensure you import Django's timezone module
import pytz

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  # Include fields you want to display for the user


class LocationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)


class RatingReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source='reviewer.username')
    reviewee = serializers.ReadOnlyField(source='reviewee.username')
    job_title = serializers.ReadOnlyField(source='job.title')
    class Meta:
        model = RatingReview
        fields = ('id', 'job','job_title', 'reviewer', 'reviewee', 'rating', 'review', 'created_at')

class JobApplicationSerializer(serializers.ModelSerializer):
    caregiver = serializers.ReadOnlyField(source='caregiver.username')  # Caregiver username
    caregiver_id = serializers.ReadOnlyField(source='caregiver.id')  # Caregiver ID
    has_applied = serializers.SerializerMethodField()  # Add the calculated field 'has_applied'
    job_title = serializers.ReadOnlyField(source='job.title')
    class Meta:
        model = JobApplication
        fields = ('id', 'job', 'job_title','caregiver', 'caregiver_id', 'cover_letter', 'applied_at', 'has_applied', 'status')
        extra_kwargs = {
            'job': {'required': False},  # Make 'job' not required in the incoming data
        }

    # Method to calculate if the current caregiver has applied for the job
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and hasattr(request.user, 'caregiver'):
            # Check if the current caregiver has already applied for this job
            return JobApplication.objects.filter(job=obj.job, caregiver=request.user).exists()
        return False

    def create(self, validated_data):
        # Remove the job from validated_data because it's being passed explicitly
        job = self.context['job']
        caregiver = self.context['request'].user
        validated_data['job'] = job
        validated_data['caregiver'] = caregiver
        return super().create(validated_data)

class JobSerializer(serializers.ModelSerializer):
    care_seeker = UserSerializer(read_only=True)  # Use nested UserSerializer
    caregiver = UserSerializer(read_only=True)  # Use nested UserSerializer
    has_applied = serializers.SerializerMethodField()  # New field to check if the user has applied

    class Meta:
        model = Job
        fields = (
            'id', 'care_seeker', 'caregiver', 'title', 'description',
            'location', 'job_type', 'pay_rate', 'status', 'scheduled_time',
            'proposed_time', 'accepted_time', 'created_at', 'updated_at', 'has_applied'
        )

    def get_has_applied(self, obj):
        """
        Checks if the current authenticated user has applied for the job.
        """
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            # Check if the current user (caregiver) has already applied for this job
            return JobApplication.objects.filter(job=obj, caregiver=request.user).exists()
        return False
    

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'job', 'caregiver', 'description', 'scheduled_time','status']

    def validate_scheduled_time(self, value):
        # Convert the scheduled time to Zambian time
        zambia_tz = pytz.timezone('Africa/Lusaka')
        value = value.astimezone(zambia_tz)

        # Get the job associated with the task
        job_id = self.initial_data.get('job')
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            raise serializers.ValidationError("Job does not exist.")

        # Ensure the scheduled time is not in the past
        if value < timezone.now().astimezone(zambia_tz):
            raise serializers.ValidationError("Scheduled time cannot be in the past.")

        # Ensure the scheduled time is not before the job's scheduled time
        if value < job.scheduled_time.astimezone(zambia_tz):
            raise serializers.ValidationError(f"Scheduled time cannot be earlier than the job's scheduled time of {job.scheduled_time.astimezone(zambia_tz)}.")

        return value

    def create(self, validated_data):
        return Task.objects.create(**validated_data)