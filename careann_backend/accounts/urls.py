
from django.urls import path
from .views import RegisterView, LoginView,ProfileView,CaregiverSearchView,CaregiverDetailView, CareSeekerDetailView 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('caregivers/<int:pk>/', CaregiverDetailView.as_view(), name='caregiver-detail'),
    path('careseekers/<int:pk>/', CareSeekerDetailView.as_view(), name='careseeker-detail'),  # Add this line for care seekers

    path('caregivers/search/', CaregiverSearchView.as_view(), name='caregiver-search'),
]
