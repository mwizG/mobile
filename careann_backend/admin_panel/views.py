from rest_framework import generics, permissions
from accounts.models import CustomUser
from rest_framework.response import Response
from payments.models import Payment
from jobs.models import Job
from .models import SupportTicket, Dispute, ModerationAction, UserActivity
from .serializers import SupportTicketSerializer, DisputeSerializer, ModerationActionSerializer, UserActivitySerializer

# Support Ticket Views
class SupportTicketListView(generics.ListCreateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAdminUser]

class SupportTicketUpdateView(generics.UpdateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAdminUser]

# Toggle User Active Status View
class ToggleUserActiveStatusView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({"status": "User status updated", "is_active": user.is_active})

# Payment Status Update View
class PaymentUpdateView(generics.UpdateAPIView):
    queryset = Payment.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        payment = self.get_object()
        payment.status = request.data.get('status', payment.status)
        payment.save()
        return Response({"status": "Payment status updated", "new_status": payment.status})

# Analytics View
class AnalyticsView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        data = {
            "total_users": CustomUser.objects.count(),
            "total_jobs": Job.objects.count(),
            "total_payments": Payment.objects.count(),
            "pending_payments": Payment.objects.filter(status='Pending').count(),
            "total_disputes": Dispute.objects.count(),
            "resolved_disputes": Dispute.objects.filter(status='Resolved').count(),
            "moderation_actions": ModerationAction.objects.count(),
        }
        return Response(data)

# Dispute Views
class DisputeListView(generics.ListCreateAPIView):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Dispute.objects.all()
        return Dispute.objects.filter(created_by=self.request.user)

class DisputeDetailView(generics.RetrieveUpdateAPIView):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

# Moderation Action Views
class ModerationActionListView(generics.ListCreateAPIView):
    queryset = ModerationAction.objects.all()
    serializer_class = ModerationActionSerializer
    permission_classes = [permissions.IsAdminUser]

class ModerationActionDetailView(generics.RetrieveUpdateAPIView):
    queryset = ModerationAction.objects.all()
    serializer_class = ModerationActionSerializer
    permission_classes = [permissions.IsAdminUser]

# User Activity Views
class UserActivityListView(generics.ListAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return UserActivity.objects.all().order_by('-timestamp')
