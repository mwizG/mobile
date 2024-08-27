from django.shortcuts import render
# In background_checks/views.py

import requests
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import BackgroundCheck
from .serializers import BackgroundCheckSerializer
from django.conf import settings


class InitiateBackgroundCheckView(generics.CreateAPIView):
    queryset = BackgroundCheck.objects.all()
    serializer_class = BackgroundCheckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user

        # Checkr API request payload
        payload = {
            "candidate_id": user.id,
            "package": "basic_criminal",
            # Additional fields required by the Checkr API
        }

        response = requests.post(
            f"{settings.CHECKR_BASE_URL}/background_checks",
            json=payload,
            auth=(settings.CHECKR_API_KEY, '')
        )

        if response.status_code == 201:
            checkr_data = response.json()
            background_check = BackgroundCheck.objects.create(
                user=user,
                checkr_id=checkr_data['id'],
                status=checkr_data['status']
            )
            return Response(BackgroundCheckSerializer(background_check).data, status=201)
        else:
            return Response({"error": "Failed to initiate background check"}, status=response.status_code)



class BackgroundCheckStatusView(generics.RetrieveAPIView):
    queryset = BackgroundCheck.objects.all()
    serializer_class = BackgroundCheckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure the user is retrieving their own background check
        return self.queryset.filter(user=self.request.user)