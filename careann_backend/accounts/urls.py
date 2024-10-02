
from django.urls import path
from .views import CaregiverCredentialsView, CertificationDetailView, CertificationListView, ExperienceCategoryListView, RegisterView,UploadCredentialsView,LoginView,ProfileView,CaregiverSearchView,CaregiverDetailView,CaregiverByJobTypeView,CareSeekerDetailView 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('caregivers/<int:pk>/', CaregiverDetailView.as_view(), name='caregiver-detail'),
    path('careseekers/<int:pk>/', CareSeekerDetailView.as_view(), name='careseeker-detail'),  # Add this line for care seekers

    path('caregivers/service/<str:serviceType>/', CaregiverByJobTypeView.as_view(), name='caregivers-by-service'),
    path('upload_credentials/', UploadCredentialsView.as_view(), name='upload_credentials'),
    path('caregivers/search/', CaregiverSearchView.as_view(), name='caregiver-search'),
    path('experience-categories/', ExperienceCategoryListView.as_view(), name='experience-category-list'),
    path('credentials/', CertificationListView.as_view(), name='certification-list'),  # List and Create endpoint
    path('credentials/<int:pk>/', CertificationDetailView.as_view(), name='certification-detail'),  # Retrieve and Delete endpoint
    path('caregivers/<int:caregiver_id>/credentials/', CaregiverCredentialsView.as_view(), name='caregiver-credentials'),
]
