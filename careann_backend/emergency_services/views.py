from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import EmergencyService
from .serializers import EmergencyServiceSerializer

class EmergencyServiceCreateView(generics.CreateAPIView):
    queryset = EmergencyService.objects.all()
    serializer_class = EmergencyServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        service_type = request.data.get('service_type')
        location = request.data.get('location')
        details = request.data.get('details')

        # Validation checks
        if not service_type:
            return Response({"error": "Service type is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not location:
            return Response({"error": "Location is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Creating the EmergencyService instance
        emergency_service = EmergencyService.objects.create(
            requested_by=user,  # corrected field from 'user' to 'requested_by'
            service_type=service_type,
            location=location,
            details=details
        )

        # Integration with external APIs for real-time emergency services can be added here

        return Response(EmergencyServiceSerializer(emergency_service).data, status=status.HTTP_201_CREATED)


class EmergencyServiceListView(generics.ListAPIView):
    serializer_class = EmergencyServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyService.objects.filter(requested_by=self.request.user).order_by('-created_at')