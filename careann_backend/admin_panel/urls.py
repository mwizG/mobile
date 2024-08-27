
from django.urls import path
from .views import ToggleUserActiveStatusView,PaymentUpdateView,AnalyticsView,SupportTicketListView,SupportTicketUpdateView

urlpatterns = [
    path('user/<int:pk>/toggle-active/', ToggleUserActiveStatusView.as_view(), name='toggle-user-active'),
    path('payment/<int:pk>/update-status/', PaymentUpdateView.as_view(), name='update-payment-status'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('tickets/', SupportTicketListView.as_view(), name='ticket-list'),
    path('ticket/<int:pk>/update/', SupportTicketUpdateView.as_view(), name='ticket-update'),
]
