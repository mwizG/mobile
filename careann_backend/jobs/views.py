# In jobs/views.py

from rest_framework import generics, permissions, filters
from .models import Job,JobApplication
from .serializers import JobSerializer, JobApplicationSerializer
from rest_framework import status
from rest_framework.response import Response
from .models import RatingReview
from .serializers import RatingReviewSerializer
from rest_framework import serializers


class RatingReviewCreateView(generics.CreateAPIView):
    queryset = RatingReview.objects.all()
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        job = serializer.validated_data['job']
        if job.status != 'Completed':
            raise serializers.ValidationError("You can only leave a review after the job is completed.")
        
        if self.request.user == job.care_seeker:
            # Care seeker is reviewing the caregiver
            serializer.save(reviewer=self.request.user, reviewee=job.caregiver)
        elif self.request.user == job.caregiver:
            # Caregiver is reviewing the care seeker
            serializer.save(reviewer=self.request.user, reviewee=job.care_seeker)
        else:
            raise serializers.ValidationError("You are not authorized to review this job.")
        
        
class RatingReviewListView(generics.ListAPIView):
    queryset = RatingReview.objects.all()
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

    def perform_create(self, serializer):
        serializer.save(caregiver=self.request.user)

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

class JobApplicationUpdateView(generics.UpdateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow care seekers to update the status of applications for their jobs
        user = self.request.user
        if user.is_care_seeker:
            return JobApplication.objects.filter(job__care_seeker=user)
        return JobApplication.objects.none()



class CaregiverJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(caregiver=self.request.user, status='In Progress')

class AcceptJobView(generics.UpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.status != 'Open':
            return Response({"error": "Job is no longer available."}, status=400)

        job.caregiver = request.user
        job.status = 'In Progress'
        job.scheduled_time = request.data.get('scheduled_time')
        job.save()
        return Response(JobSerializer(job).data)

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