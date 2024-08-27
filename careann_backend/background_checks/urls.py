
from django.urls import path
from .views import InitiateBackgroundCheckView, BackgroundCheckStatusView

urlpatterns = [
    path('initiate/', InitiateBackgroundCheckView.as_view(), name='initiate-background-check'),
    path('<int:pk>/status/', BackgroundCheckStatusView.as_view(), name='background-check-status'),
]