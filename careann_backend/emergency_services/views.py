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
        details = request.data.get('details')

        if not service_type:
            return Response({"error": "Service type is required."}, status=status.HTTP_400_BAD_REQUEST)

        emergency_service = EmergencyService.objects.create(
            user=user,
            service_type=service_type,
            details=details
        )

        # Here you can add integration with an external API for real-time ambulance or pharmacy services

        return Response(EmergencyServiceSerializer(emergency_service).data, status=status.HTTP_201_CREATED)
