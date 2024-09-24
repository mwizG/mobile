# In jobs/views.py

from rest_framework import generics, permissions, filters
from .models import Job,JobApplication
from .serializers import JobSerializer, JobApplicationSerializer
from rest_framework import status
from rest_framework.response import Response
from .models import RatingReview
from .serializers import RatingReviewSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Task
from .serializers import TaskSerializer
from rest_framework.views import APIView



class TaskCreateView(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(caregiver=self.request.user)

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

        # Mark the task as complete if needed
        if request.data.get('status') == 'complete':
            task.status = 'Completed'
            task.save()

        return super().patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        task = self.get_object()
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        if request.user != job.care_seeker:
            return Response({"error": "You are not authorized to propose a time for this job."}, status=status.HTTP_403_FORBIDDEN)

        proposed_time = request.data.get('proposed_time')
        if not proposed_time:
            return Response({"error": "Proposed time is required."}, status=status.HTTP_400_BAD_REQUEST)

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
        if self.request.user != job.care_seeker and self.request.user != job.caregiver:
            raise serializers.ValidationError("You are not authorized to review this job.")

        # Determine reviewee
        reviewee = job.caregiver if self.request.user == job.care_seeker else job.care_seeker
        serializer.save(reviewer=self.request.user, reviewee=reviewee)





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


class OpenJobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']



class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']

    def get_queryset(self):
        jobs_queryset = Job.objects.filter(status='Open')  # Fetch only Open jobs
        
        return jobs_queryset


# For fetching all jobs (without status filtering)
class AllJobsListView(generics.ListAPIView):
    queryset = Job.objects.all()  # Fetch all jobs
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
       
        return Response(serializer.data)

# For fetching only 'Open' jobs
class OpenJobsListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']

    def get_queryset(self):
        jobs_queryset = Job.objects.filter(status='Open')  # Fetch only Open jobs
        print(f"SQL Query being executed for Open jobs: {jobs_queryset.query}")
        return jobs_queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        print(f"Response data for Open jobs: {serializer.data}")
        return Response(serializer.data)



class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        job = self.get_object()

        # Check if the user is the owner of the job or an admin
        if request.user != job.care_seeker and not request.user.is_staff:
            return Response({"error": "You are not authorized to delete this job."}, status=status.HTTP_403_FORBIDDEN)

        # Allow the deletion if the user is the owner or admin
        return super().delete(request, *args, **kwargs)

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

    # You need to override the get_queryset method
    def get_queryset(self):
        # Return only jobs that are open
        return Job.objects.filter(status='Open')

    def update(self, request, *args, **kwargs):
        job = self.get_object()  # This now uses the queryset from get_queryset()
        
        # Ensure the caregiver is accepting the job
        if job.caregiver != request.user:
            return Response({"error": "You are not authorized to accept this job."}, status=status.HTTP_403_FORBIDDEN)

        # Only allow the job to be accepted if it is still open
        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=400)

        # Caregiver accepts the job and the status changes to "In Progress"
        job.status = 'In Progress'
        job.scheduled_time = request.data.get('scheduled_time')  # Optional scheduled time
        job.save()

        return Response(JobSerializer(job).data)
 

class AcceptJobTimeView(generics.UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        job = self.get_object()

        # Ensure the job has an assigned caregiver
        if job.caregiver != request.user:
            return Response({"error": "You are not authorized to accept the proposed time for this job."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure the job has a proposed time
        if not job.proposed_time:
            return Response({"error": "No proposed time to accept."}, status=status.HTTP_400_BAD_REQUEST)

        # Accept the proposed time
        job.accepted_time = job.proposed_time
        job.save()

        return Response(JobSerializer(job).data, status=status.HTTP_200_OK)



class DeclineJobView(generics.UpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Add get_queryset to filter only 'Open' jobs
    def get_queryset(self):
        return Job.objects.filter(status='Open')

    def update(self, request, *args, **kwargs):
        job = self.get_object()  # This now uses the queryset from get_queryset()

        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=400)

        # Ensure only the caregiver can decline the job
        if job.caregiver != request.user:
            return Response({"error": "You are not authorized to decline this job."}, status=status.HTTP_403_FORBIDDEN)

        # Set job status to 'Declined'
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
