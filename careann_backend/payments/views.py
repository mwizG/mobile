
from rest_framework import generics, permissions
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from jobs.models import Job
import stripe

class PaymentCreateView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        job = Job.objects.get(id=request.data['job'])
        if request.user != job.care_seeker:
            return Response({"error": "You are not authorized to make a payment for this job."}, status=status.HTTP_403_FORBIDDEN)

        amount = request.data['amount']

        try:
            # Create a Stripe charge
            charge = stripe.Charge.create(
                amount=int(float(amount) * 100),  # Stripe uses cents
                currency="usd",
                description=f"Payment for job: {job.title}",
                source=request.data['stripe_token']
            )

            # Create the payment record
            payment = Payment.objects.create(
                job=job,
                amount=amount,
                care_seeker=request.user,
                caregiver=job.caregiver,
                stripe_charge_id=charge['id'],
                status='Completed'
            )

            return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_care_seeker:
            return Payment.objects.filter(care_seeker=user)
        elif user.is_caregiver:
            return Payment.objects.filter(caregiver=user)
        return Payment.objects.none()
