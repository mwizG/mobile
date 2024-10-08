
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
 

# Ensure zambia_tz is defined
zambia_tz = pytz.timezone("Africa/Lusaka")

# Convert string to timezone-aware datetime
def localize_datetime(dt_str):
    """
    Convert an ISO format string or datetime object to a timezone-aware datetime object.
    """
    if isinstance(dt_str, str):
        dt = timezone.datetime.fromisoformat(dt_str)
    else:
        dt = dt_str

    if timezone.is_naive(dt):
        return timezone.make_aware(dt, zambia_tz)
    return dt


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'job', 'caregiver', 'description', 'scheduled_time', 'end_time', 'status']  # Include 'end_time'
        read_only_fields = ['caregiver']  # Caregiver will be set in the create method

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
        # Assuming the caregiver is the currently authenticated user
        validated_data['caregiver'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, data):
        # Handle the end_time validation as before
        scheduled_time = data.get('scheduled_time')
        end_time = data.get('end_time')

        if scheduled_time and end_time:
            if scheduled_time > end_time:
                raise serializers.ValidationError("Scheduled time must be less than or equal to end time.")

            if (scheduled_time and not end_time) or (end_time and not scheduled_time):
                raise serializers.ValidationError("Both scheduled time and end time must be provided together.")

        return data