from django.urls import path

from .views import JobCreateView, JobListView, JobDetailView, JobApplicationCreateView, JobApplicationListView, JobApplicationUpdateView,RatingReviewCreateView, RatingReviewListView

urlpatterns = [
    path('create/', JobCreateView.as_view(), name='job-create'),
    path('search/', JobListView.as_view(), name='job-search'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:job_id>/apply/', JobApplicationCreateView.as_view(), name='job-apply'),
    path('applications/', JobApplicationListView.as_view(), name='job-applications'),
    path('applications/<int:pk>/', JobApplicationUpdateView.as_view(), name='job-application-update'),
    path('rate/', RatingReviewCreateView.as_view(), name='rating-create'),
    path('reviews/', RatingReviewListView.as_view(), name='rating-list'),
]