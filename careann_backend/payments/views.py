
from rest_framework import generics, permissions
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Payment,Subscription
from .serializers import PaymentSerializer,SubscriptionSerializer
from jobs.models import Job
import stripe
from .serializers import SubscriptionSerializer
from django.conf import settings

# Set your Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY

class SubscriptionCreateView(generics.CreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        caregiver = request.user
        plan_type = request.data.get('plan_type')
        stripe_token = request.data.get('stripe_token')

        if not plan_type or not stripe_token:
            return Response({"error": "Plan type and Stripe token are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a Stripe customer
            customer = stripe.Customer.create(
                email=caregiver.email,
                source=stripe_token
            )

            # Determine the Stripe plan ID based on the plan_type
            stripe_plan_id = f"{plan_type}_plan_id"  # Replace with your actual Stripe plan IDs

            # Create a Stripe subscription
            stripe_subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{'plan': stripe_plan_id}],
            )

            # Create the subscription record in the database
            subscription = Subscription.objects.create(
                caregiver=caregiver,
                plan_type=plan_type,
                status='active'
            )

            return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class SubscriptionListView(generics.ListAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(caregiver=self.request.user)


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
