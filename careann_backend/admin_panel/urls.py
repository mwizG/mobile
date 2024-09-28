from django.urls import path
# In your urls.py
from .views import (
    UserListView, ToggleUserActiveStatusView, PaymentUpdateView, AnalyticsView,
    SupportTicketListView, SupportTicketUpdateView, DisputeListView, DisputeDetailView,
    ModerationActionListView, ModerationActionDetailView, UserActivityListView
)

urlpatterns = [
    # Existing URLs
    path('user/<int:pk>/toggle-active/', ToggleUserActiveStatusView.as_view(), name='toggle-user-active'),
    path('payment/<int:pk>/update-status/', PaymentUpdateView.as_view(), name='update-payment-status'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('tickets/', SupportTicketListView.as_view(), name='ticket-list'),
    path('ticket/<int:pk>/update/', SupportTicketUpdateView.as_view(), name='ticket-update'),

    # New User List URL
    path('users/', UserListView.as_view(), name='user-list'),

    # New Dispute URLs
    path('disputes/', DisputeListView.as_view(), name='dispute-list'),
    path('disputes/<int:pk>/', DisputeDetailView.as_view(), name='dispute-detail'),

    # New Moderation Action URLs
    path('moderation-actions/', ModerationActionListView.as_view(), name='moderation-action-list'),
    path('moderation-actions/<int:pk>/', ModerationActionDetailView.as_view(), name='moderation-action-detail'),

    # New User Activity URLs
    path('user-activities/', UserActivityListView.as_view(), name='user-activity-list'),
]
