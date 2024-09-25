from django.urls import path

from .views import TaskCreateView,JobApplicationListByJobView,UpdateJobStatusView,CompleteJobView,ApproveJobCompletionView,TaskListView,JobCreateView,AllJobsListView, OpenJobsListView,JobListView, JobDetailView,TaskDetailView, JobApplicationCreateView, JobApplicationListView, JobApplicationUpdateView,ListRatingReviewView, CreateRatingReviewView,CaregiverJobsView, AcceptJobView, DeclineJobView,ProposeJobTimeView,AcceptJobTimeView

urlpatterns = [
    path('create/', JobCreateView.as_view(), name='job-create'),
    path('search/', JobListView.as_view(), name='job-search'),
    path('create/', JobCreateView.as_view(), name='job-create'),
    path('all-jobs/', AllJobsListView.as_view(), name='all-jobs'),
    path('open-jobs/', OpenJobsListView.as_view(), name='open-jobs'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:job_id>/apply/', JobApplicationCreateView.as_view(), name='job-apply'),
    path('applications/', JobApplicationListView.as_view(), name='job-applications'),
    path('applications/<int:pk>/', JobApplicationUpdateView.as_view(), name='job-application-update'),
    path('reviews/create/', CreateRatingReviewView.as_view(), name='create-review'),
    path('reviews/', ListRatingReviewView.as_view(), name='list-reviews'),
    path('caregiver-jobs/', CaregiverJobsView.as_view(), name='caregiver-jobs'),
    path('<int:pk>/accept/', AcceptJobView.as_view(), name='accept-job'),
    path('<int:pk>/decline/', DeclineJobView.as_view(), name='decline-job'),
    path('<int:pk>/propose-time/', ProposeJobTimeView.as_view(), name='propose-job-time'),
    path('<int:pk>/accept-time/', AcceptJobTimeView.as_view(), name='accept-job-time'),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/create/', TaskCreateView.as_view(), name='task-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('<int:job_id>/applications/', JobApplicationListByJobView.as_view(), name='job-applications-by-job'),
    path('<int:job_id>/complete/', CompleteJobView.as_view(), name='complete-job'),
    path('<int:pk>/update-status/', UpdateJobStatusView.as_view(), name='update-job-status'),
    path('<int:pk>/approve-completion/', ApproveJobCompletionView.as_view(), name='approve-job-completion'),
    path('<int:job_id>/approve-completion/', ApproveJobCompletionView.as_view(), name='approve-completion'),
  
]