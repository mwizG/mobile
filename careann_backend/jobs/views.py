# In jobs/views.py
from django_filters import rest_framework as filters
from rest_framework import filters as drf_filters
from accounts.models import ExperienceCategory
from accounts.serializers import JobTypeSerializer
from rest_framework import generics, permissions, filters
from .models import Job,JobApplication
from .serializers import JobSerializer, JobApplicationSerializer
from rest_framework import status
from rest_framework.response import Response
from .models import RatingReview
from .serializers import RatingReviewSerializer,LocationSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Task
from .serializers import TaskSerializer
from rest_framework.views import APIView
from .models import ZAMBIA_LOCATIONS
from django_filters import rest_framework as filters
from datetime import timedelta, datetime
from django.utils import timezone
from django.db.models import Q
from rest_framework_simplejwt.authentication import JWTAuthentication



class LocationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LocationSerializer

    def get_queryset(self):
        # Convert ZAMBIA_LOCATIONS to a list of dictionaries to use with the serializer
        return [{'name': location[1]} for location in ZAMBIA_LOCATIONS]



class TaskCreateView(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Log the incoming data for debugging
        print("Request data:", request.data)  # Adjusted for correct logging

        # Set the caregiver to the current user
        request.data['caregiver'] = request.user.id  # Set the caregiver to the authenticated user

        return super().create(request, *args, **kwargs)
  
    
class TaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(caregiver=self.request.user).order_by('scheduled_time')


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show tasks for the currently logged-in caregiver
        return Task.objects.filter(caregiver=self.request.user)

    def patch(self, request, *args, **kwargs):
        task = self.get_object()
        print(f"PATCH Request Data: {request.data}")

        # Use the serializer to validate and update the data
        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        task = self.get_object()

        # Check if the user is the owner of the task or an admin
        if request.user != task.caregiver and not request.user.is_staff:
            return Response({"error": "You are not authorized to delete this task."}, status=status.HTTP_403_FORBIDDEN)

        # Restrict deletion if the task is in 'In Progress' status
        if task.status == 'In Progress':
            return Response({"error": "Cannot delete a task that is in progress."}, status=status.HTTP_400_BAD_REQUEST)

        # Perform soft delete by updating the status to 'Deleted'
        task.status = 'Deleted'
        task.save()
        return Response({"message": "Task marked as deleted and is now only visible to admins."}, status=status.HTTP_200_OK)



class CompleteJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, job_id):
        job = Job.objects.get(id=job_id)
        if request.user != job.care_seeker:
            return Response({"error": "Only care seekers can mark the job as completed."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure all tasks are completed
        if job.tasks.filter(status='Pending').exists():
            return Response({"error": "Cannot complete job until all tasks are completed."}, status=status.HTTP_400_BAD_REQUEST)

        job.status = 'Completed'
        job.save()

        return Response({"message": "Job marked as completed."}, status=status.HTTP_200_OK)
    
class ProposeJobTimeView(generics.UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        print(f"Request Data: {request.data}")
        print(f"Job ID: {kwargs['pk']}")
        job = self.get_object()

        # Ensure the user is authorized to propose a time
        if request.user != job.care_seeker:
            return Response({"error": "You are not authorized to propose a time for this job."}, status=status.HTTP_403_FORBIDDEN)

        proposed_time = request.data.get('proposed_time')
        if not proposed_time:
            return Response({"error": "Proposed time is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Convert the proposed time to a datetime object
        try:
            proposed_time = timezone.datetime.fromisoformat(proposed_time)
        except ValueError:
            return Response({"error": "Invalid datetime format."}, status=status.HTTP_400_BAD_REQUEST)

        # Make the datetime object timezone-aware if it is not already
        if proposed_time.tzinfo is None:
            proposed_time = timezone.make_aware(proposed_time)

        # Check for scheduling conflicts with the caregiver's other jobs
        caregiver_jobs = Job.objects.filter(caregiver=job.caregiver).exclude(id=job.id)

        for caregiver_job in caregiver_jobs:
            if caregiver_job.scheduled_time:
                # Ensure that caregiver_job.scheduled_time is timezone-aware
                if caregiver_job.scheduled_time.tzinfo is None:
                    caregiver_job.scheduled_time = timezone.make_aware(caregiver_job.scheduled_time)

                # Calculate the time difference
                time_difference = abs(caregiver_job.scheduled_time - proposed_time)

                # Check if the time difference is less than or equal to 2 hours
                if time_difference <= timedelta(hours=2):
                    return Response({
                        "error": "Scheduling conflict: Caregiver has another job scheduled within 2 hours of this time. Please propose a different time."
                    }, status=status.HTTP_400_BAD_REQUEST)

        # If no conflicts, proceed to update the job's proposed time
        job.proposed_time = proposed_time
        job.save()

        return Response(JobSerializer(job).data, status=status.HTTP_200_OK)
 
class CreateRatingReviewView(generics.CreateAPIView):
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        job = Job.objects.get(id=self.request.data['job'])

        # Only allow reviews for completed jobs
        if job.status != 'Completed':
            raise serializers.ValidationError("Reviews can only be submitted for completed jobs.")

        # Ensure the reviewer is the care seeker or caregiver for this job
        if self.request.user != job.care_seeker:
            raise serializers.ValidationError("You are not authorized to review this job.")

        # Determine reviewee (in this case, the caregiver)
        reviewee = job.caregiver
        
        # Save the new review
        serializer.save(reviewer=self.request.user, reviewee=reviewee)
        
        # Update the caregiver's average rating
        new_rating = serializer.validated_data['rating']
        reviewee.rating_count += 1
        
        # Use incremental average formula
        reviewee.average_rating = (
            (reviewee.average_rating * (reviewee.rating_count - 1)) + new_rating
        ) / reviewee.rating_count
        
        reviewee.save()



class ListRatingReviewView(generics.ListAPIView):
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return RatingReview.objects.filter(reviewee=user)



class JobCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(care_seeker=self.request.user)



class AdminDeletedJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        # Show only jobs that are marked as 'Deleted'
        return Job.objects.filter(status='Deleted')

class JobFilter(filters.FilterSet):
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    job_type = filters.CharFilter(field_name='job_type', lookup_expr='icontains')
    pay_rate = filters.NumberFilter(field_name='pay_rate')
    status = filters.ChoiceFilter(choices=[('Open', 'Open'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Declined', 'Declined')])

    class Meta:
        model = Job
        fields = ['location', 'job_type', 'pay_rate', 'status']


class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny] 
    authentication_classes = [JWTAuthentication] # Anyone can access this view
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = JobFilter

    def get_queryset(self):
        return Job.objects.filter(Q(status='Open') | Q(status='Declined')).exclude(status='Deleted')

class OpenJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = (filters.DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter)
    filterset_class = JobFilter
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Job.objects.filter(status='Open').exclude(status='Deleted')

class JobTypeListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobTypeSerializer

    def get_queryset(self):
        return ExperienceCategory.objects.all()

class AllJobsListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [drf_filters.SearchFilter, drf_filters.OrderingFilter]  # Use the correct filters here
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']

    def get_queryset(self):
        return Job.objects.exclude(status='Deleted')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class OpenJobsListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [drf_filters.SearchFilter, drf_filters.OrderingFilter]  # Use the correct filters here
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']

    def get_queryset(self):
        jobs_queryset = Job.objects.filter(status='Open')
        print(f"SQL Query being executed for Open jobs: {jobs_queryset.query}")
        return jobs_queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        print(f"Response data for Open jobs: {serializer.data}")
        return Response(serializer.data)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Job.objects.all()  # Admins can see all jobs
        return Job.objects.exclude(status='Deleted')  # Regular users can't see deleted jobs

    def delete(self, request, *args, **kwargs):
        job = self.get_object()

        # Check if the user is the owner of the job or an admin
        if request.user != job.care_seeker and not request.user.is_staff:
            return Response({"error": "You are not authorized to delete this job."}, status=status.HTTP_403_FORBIDDEN)

        # Restrict deletion if the job is in 'In Progress' status
        if job.status == 'In Progress':
            return Response({"error": "Cannot delete a job that is in progress."}, status=status.HTTP_400_BAD_REQUEST)

        # Perform soft delete by updating the status to 'Deleted'
        job.status = 'Deleted'
        job.save()
        return Response({"message": "Job marked as deleted and is now only visible to admins."}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        job = self.get_object()

        # Check if the user is the owner of the job or an admin
        if request.user != job.care_seeker and not request.user.is_staff:
            return Response({"error": "You are not authorized to update this job."}, status=status.HTTP_403_FORBIDDEN)

        # Allow the update if the user is the owner or admin
        return super().update(request, *args, **kwargs)




class JobApplicationCreateView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        job_id = self.kwargs.get('job_id')  # Get the job_id from the URL
        job = generics.get_object_or_404(Job, id=job_id)  # Ensure the job exists
        print(f"Job ID: {job_id}, Job: {job}")

       
        # Check if the caregiver has already applied for this job
        if JobApplication.objects.filter(job=job, caregiver=request.user).exists():
            raise ValidationError("You have already applied for this job.")

        # Create a new job application
        serializer = self.get_serializer(data=request.data, context={'job': job, 'request': request})
        if not serializer.is_valid():
            # Print validation errors
            print("Validation Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data)


class JobApplicationListView(generics.ListAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If the user is a care seeker, show applications for their jobs
        if user.is_care_seeker:
            return JobApplication.objects.filter(job__care_seeker=user)
        # If the user is a caregiver, show their applications
        elif user.is_caregiver:
            return JobApplication.objects.filter(caregiver=user)
        return JobApplication.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = serializer.data  # Get serialized data

        # Log or print the response data
        print("Response Data:", response_data)  # This will log to your console

        return Response(response_data)  # Return the serialized data as the response



class JobApplicationUpdateView(generics.RetrieveUpdateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        application = self.get_object()
        job = application.job
        
        # Ensure the user is the care seeker for this job
        if request.user != job.care_seeker:
            return Response({"error": "You are not authorized to update this application."}, status=status.HTTP_403_FORBIDDEN)
        
        # Update the application status to "Accepted"
        new_status = request.data.get('status')
        if new_status == 'Accepted':
            application.status = 'Accepted'
            application.save()

            # Update the job caregiver but DO NOT change the job status yet
            job.caregiver = application.caregiver
            job.save()

        # Proceed with normal partial update for any other fields
        serializer = self.get_serializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
    

class CaregiverJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only jobs where the logged-in user is the caregiver and the job is either accepted or in progress
        return Job.objects.filter(caregiver=self.request.user, status__in=['Accepted', 'In Progress'])


class AcceptJobView(generics.UpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(status='Open')

    def update(self, request, *args, **kwargs):
        job = self.get_object()

        # Print the incoming request data
        print("Request Data:", request.data)

        if job.caregiver != request.user:
            return Response({"error": "You are not authorized to accept this job."}, status=status.HTTP_403_FORBIDDEN)

        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=400)

        # Extract the scheduled time from request data
        scheduled_time = request.data.get('scheduled_time')
        
        # Ensure that scheduled_time is present in the request data
        if not scheduled_time:
            return Response({"error": "Scheduled time is required."}, status=400)

        # Convert scheduled_time to a timezone-aware datetime object
        proposed_time = timezone.datetime.fromisoformat(scheduled_time)

        # Check for scheduling conflicts
        caregiver_jobs = Job.objects.filter(caregiver=request.user).exclude(id=job.id)
        
        for caregiver_job in caregiver_jobs:
            if caregiver_job.scheduled_time:
                time_difference = abs(caregiver_job.scheduled_time - proposed_time)
                # Check if the time difference is less than or equal to 2 hours
                if time_difference <= timedelta(hours=2):
                    return Response({"error": "Scheduling conflict: You have another job scheduled within 2 hours of this time."}, status=400)

        # If no conflicts, proceed to accept the job
        job.status = 'In Progress'
        job.scheduled_time = proposed_time
        job.accepted_time = proposed_time
        
        # Log the job data before saving
        print("Job Data Before Save:", JobSerializer(job).data)

        job.save()

        # Log the job data after saving
        print("Job Data After Save:", JobSerializer(job).data)

        return Response(JobSerializer(job).data)



class AcceptJobTimeView(generics.UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        job = self.get_object()

        # Print incoming request data
        print("Request Data:", request.data)

        # Ensure the job has an assigned caregiver
        if job.caregiver != request.user:
            return Response({"error": "You are not authorized to accept the proposed time for this job."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure the job has a proposed time
        if not job.proposed_time:
            return Response({"error": "No proposed time to accept."}, status=status.HTTP_400_BAD_REQUEST)

        # Log the current state of the job before updating
        print("Job before update:", JobSerializer(job).data)

        # Accept the proposed time
        job.accepted_time = job.proposed_time
        job.save()

        # Log the updated state of the job after saving
        print("Job after update:", JobSerializer(job).data)

        return Response(JobSerializer(job).data, status=status.HTTP_200_OK)



class DeclineJobView(generics.UpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(status='Open')

    def update(self, request, *args, **kwargs):
        job = self.get_object()

        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=status.HTTP_400_BAD_REQUEST)

        if job.caregiver != request.user:
            return Response({"error": "You are not authorized to decline this job."}, status=status.HTTP_403_FORBIDDEN)

        # Update job status and application status
        job.status = 'Declined'
        job.save()

        return Response(JobSerializer(job).data)



class JobApplicationListByJobView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs['job_id']  # Get the job_id from the URL
        status = self.request.query_params.get('status', None)  # Get status from query params, default is None

        # If status is provided in the query params, filter by both job_id and status
        if status:
            return JobApplication.objects.filter(job_id=job_id, status=status)
        
        # If no status is provided, just filter by job_id
        return JobApplication.objects.filter(job_id=job_id)
    

class ApproveJobCompletionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)

            if request.user != job.care_seeker:
                return Response({"error": "Only the care seeker can approve the job completion."}, status=status.HTTP_403_FORBIDDEN)

            new_status = request.data.get('status')

            # If the care seeker rejects, revert to "In Progress"
            if new_status == 'In Progress':
                job.status = 'In Progress'
            elif new_status == 'Completed':
                job.status = 'Completed'

            job.save()

            return Response(JobSerializer(job).data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateJobStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)

            if request.user != job.caregiver:
                return Response({"error": "You are not authorized to update the job status."}, status=status.HTTP_403_FORBIDDEN)

            new_status = request.data.get('status')

            # Caregiver cannot set status directly to Completed
            if new_status == 'Completed':
                return Response({"error": "Caregiver cannot set the job status to Completed."}, status=status.HTTP_400_BAD_REQUEST)

            job.status = new_status
            job.save()

            return Response(JobSerializer(job).data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        



class ScheduledJobsListView(generics.ListAPIView):
    """
    View to list all scheduled jobs for the caregiver.
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Return jobs where caregiver is the logged-in user and scheduled_time is not null
        return Job.objects.filter(caregiver=user).exclude(scheduled_time=None)

class CompletedJobsListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(status='Completed')