from django.urls import path

from .views import JobCreateView, JobListView, JobDetailView, JobApplicationCreateView, JobApplicationListView, JobApplicationUpdateView,ListRatingReviewView, CreateRatingReviewView,CaregiverJobsView, AcceptJobView, DeclineJobView

urlpatterns = [
    path('create/', JobCreateView.as_view(), name='job-create'),
    path('search/', JobListView.as_view(), name='job-search'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:job_id>/apply/', JobApplicationCreateView.as_view(), name='job-apply'),
    path('applications/', JobApplicationListView.as_view(), name='job-applications'),
    path('applications/<int:pk>/', JobApplicationUpdateView.as_view(), name='job-application-update'),
    path('reviews/create/', CreateRatingReviewView.as_view(), name='create-review'),
    path('reviews/', ListRatingReviewView.as_view(), name='list-reviews'),
    path('caregiver-jobs/', CaregiverJobsView.as_view(), name='caregiver-jobs'),
    path('jobs/<int:pk>/accept/', AcceptJobView.as_view(), name='accept-job'),
    path('jobs/<int:pk>/decline/', DeclineJobView.as_view(), name='decline-job'),
]