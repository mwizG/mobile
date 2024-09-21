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



class AcceptJobTimeView(generics.UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if request.user != job.caregiver:
            return Response({"error": "You are not authorized to accept the proposed time for this job."}, status=status.HTTP_403_FORBIDDEN)

        job.accepted_time = job.proposed_time
        job.save()

        return Response(JobSerializer(job).data, status=status.HTTP_200_OK)
    

class CreateRatingReviewView(generics.CreateAPIView):
    queryset = RatingReview.objects.all()
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        job = Job.objects.get(id=self.request.data['job'])
        if job.status != 'Completed':
            raise serializers.ValidationError("Reviews can only be submitted for completed jobs.")
        
        # Ensure the reviewer is either the care seeker or the caregiver involved in the job
        if self.request.user != job.care_seeker and self.request.user != job.caregiver:
            raise serializers.ValidationError("You are not authorized to review this job.")
        
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

class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'job_type', 'title']
    ordering_fields = ['created_at', 'pay_rate']


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]



class JobApplicationCreateView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        job_id = self.kwargs.get('job_id')  # Get the job_id from the URL
        job = generics.get_object_or_404(Job, id=job_id)  # Ensure the job exists
        print(f"Job ID: {job_id}, Job: {job}")

        # Print the incoming request data
        print("Request Data:", request.data)

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

    def get_queryset(self):
        # Only allow care seekers to update the status of applications for their jobs
        user = self.request.user
        if user.is_care_seeker:
            return JobApplication.objects.filter(job__care_seeker=user)
        return JobApplication.objects.none()

    def get(self, request, *args, **kwargs):
        # Handle GET request to fetch job application details
        application = self.get_object()
        serializer = self.get_serializer(application)
        print("GET data:", serializer.data)
        return Response(serializer.data)
        
    def patch(self, request, *args, **kwargs):
        # Log the incoming data
        
        print(request.data)
        # Proceed with the usual update process
        application = self.get_object()
        serializer = self.get_serializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

class CaregiverJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(caregiver=self.request.user, status='In Progress')
    

class AcceptJobView(generics.UpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only jobs that are open
        return Job.objects.filter(status='Open')

    def update(self, request, *args, **kwargs):
        job = self.get_object()  # This now uses the queryset from get_queryset()
        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=400)

        job.caregiver = request.user
        job.status = 'In Progress'
        job.scheduled_time = request.data.get('scheduled_time')
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

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=400)

        job.status = 'Declined'
        job.save()
        return Response(JobSerializer(job).data)