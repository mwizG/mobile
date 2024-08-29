from django.urls import path
from .views import EmergencyServiceCreateView

urlpatterns = [
    path('emergency-service/', EmergencyServiceCreateView.as_view(), name='emergency-service-create'),
]
