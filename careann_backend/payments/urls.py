from django.urls import path
from .views import PaymentCreateView, PaymentListView,SubscriptionCreateView,SubscriptionListView

urlpatterns = [
    path('create/', PaymentCreateView.as_view(), name='payment-create'),
    path('history/', PaymentListView.as_view(), name='payment-history'),
    path('subscriptions/', SubscriptionListView.as_view(), name='subscription-list'),
    path('subscriptions/create/', SubscriptionCreateView.as_view(), name='subscription'),
]