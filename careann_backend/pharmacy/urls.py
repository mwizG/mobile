from django.urls import path
from .views import PharmacyListView, MedicationListView

urlpatterns = [
    path('pharmacies/', PharmacyListView.as_view(), name='pharmacy-list'),
    path('pharmacies/<int:pharmacy_id>/medications/', MedicationListView.as_view(), name='medication-list'),
]
