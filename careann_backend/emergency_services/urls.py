
from django.urls import path
from .views import EmergencyServiceCreateView, EmergencyServiceListView

urlpatterns = [
    path('request/', EmergencyServiceCreateView.as_view(), name='emergency-service-create'),
    path('requests/', EmergencyServiceListView.as_view(), name='emergency-service-list'),
]