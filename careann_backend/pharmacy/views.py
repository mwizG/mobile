from rest_framework import generics
from .models import Pharmacy, Medication
from .serializers import PharmacySerializer, MedicationSerializer

class PharmacyListView(generics.ListAPIView):
    queryset = Pharmacy.objects.all()
    serializer_class = PharmacySerializer

class MedicationListView(generics.ListAPIView):
    serializer_class = MedicationSerializer

    def get_queryset(self):
        pharmacy_id = self.kwargs['pharmacy_id']
        return Medication.objects.filter(pharmacy_id=pharmacy_id)
