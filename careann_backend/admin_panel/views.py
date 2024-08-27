from rest_framework import generics, permissions
from accounts.models import CustomUser
from rest_framework.response import Response
from payments.models import Payment
from django.db.models import Count
from jobs.models import Job
from payments.models import Payment
from accounts.models import CustomUser
from .models import SupportTicket
from rest_framework import generics
from .serializers import SupportTicketSerializer

class SupportTicketListView(generics.ListCreateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAdminUser]

class SupportTicketUpdateView(generics.UpdateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAdminUser]


class ToggleUserActiveStatusView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({"status": "User status updated", "is_active": user.is_active})
    


class PaymentUpdateView(generics.UpdateAPIView):
    queryset = Payment.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        payment = self.get_object()
        payment.status = request.data.get('status', payment.status)
        payment.save()
        return Response({"status": "Payment status updated", "new_status": payment.status})


class AnalyticsView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        data = {
            "total_users": CustomUser.objects.count(),
            "total_jobs": Job.objects.count(),
            "total_payments": Payment.objects.count(),
            "pending_payments": Payment.objects.filter(status='Pending').count(),
        }
        return Response(data)