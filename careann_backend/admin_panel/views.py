from rest_framework import generics, permissions  # Import permissions here
from accounts.models import CustomUser
from rest_framework.response import Response
from payments.models import Payment
from jobs.models import Job
from .models import SupportTicket, Dispute, ModerationAction, UserActivity
from .serializers import SupportTicketSerializer, DisputeSerializer, ModerationActionSerializer, UserActivitySerializer
from accounts.serializers import CustomUserSerializer

# Support Ticket Views
class SupportTicketListView(generics.ListCreateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

class SupportTicketUpdateView(generics.UpdateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

# Enhanced Toggle User Active Status View with UserActivity logging
class ToggleUserActiveStatusView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action=f"Toggled user status for {user.username}",
            description=f"User {user.username} is now {'active' if user.is_active else 'inactive'}"
        )

        return Response({"status": "User status updated", "is_active": user.is_active})

# Enhanced Payment Status Update View with UserActivity logging
class PaymentUpdateView(generics.UpdateAPIView):
    queryset = Payment.objects.all()
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

    def patch(self, request, *args, **kwargs):
        payment = self.get_object()
        old_status = payment.status
        payment.status = request.data.get('status', payment.status)
        payment.save()

        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action="Updated payment status",
            description=f"Payment ID {payment.id} status changed from {old_status} to {payment.status}"
        )

        return Response({"status": "Payment status updated", "new_status": payment.status})

# Analytics View
class AnalyticsView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

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
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

    def get_queryset(self):
        if self.request.user.is_staff:
            return Dispute.objects.all()
        return Dispute.objects.filter(created_by=self.request.user)

class DisputeDetailView(generics.RetrieveUpdateAPIView):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here


    
# Moderation Action Views
class ModerationActionListView(generics.ListCreateAPIView):
    queryset = ModerationAction.objects.all()
    serializer_class = ModerationActionSerializer
    permission_classes = [permissions.IsAdminUser]  # Admin-only access

    def create(self, request, *args, **kwargs):
        # Handle content moderation creation logic here
        return super().create(request, *args, **kwargs)

class ModerationActionDetailView(generics.RetrieveUpdateAPIView):
    queryset = ModerationAction.objects.all()
    serializer_class = ModerationActionSerializer
    permission_classes = [permissions.IsAdminUser]  # Admin-only access

    def update(self, request, *args, **kwargs):
        # Handle specific updates, such as marking content as approved/rejected
        return super().update(request, *args, **kwargs)
    


# User Activity Views
class UserActivityListView(generics.ListAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

    def get_queryset(self):
        return UserActivity.objects.all().order_by('-timestamp')

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAdminUser]  # Use admin-only permission here

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        user = request.user
        print(f"Authenticated user: {user}") 
        print('Response Data:', response.data)  # Log the response data
        return response
