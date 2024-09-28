# In accounts/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import ExperienceCategorySerializer, UserSerializer, RegisterSerializer, LoginSerializer
from . models import CustomUser,CaregiverFilter, ExperienceCategory
from django_filters.rest_framework import DjangoFilterBackend
from jobs.models import RatingReview
from django.db.models import Avg, Count
from rest_framework import status



class CaregiverSearchView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(is_caregiver=True)
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CaregiverFilter



class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Return the profile of the currently authenticated user
        return self.request.user

class CareSeekerDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.filter(is_care_seeker=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(is_care_seeker=True)

    def get_object(self):
        care_seeker_id = self.kwargs['pk']
        return CustomUser.objects.get(id=care_seeker_id, is_care_seeker=True)

class CaregiverDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.filter(is_caregiver=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        caregiver_id = self.kwargs['pk']
        return CustomUser.objects.get(id=caregiver_id, is_caregiver=True)

    def retrieve(self, request, *args, **kwargs):
        caregiver = self.get_object()

        # Fetch all ratings for the caregiver from the RatingReview model
        reviews = RatingReview.objects.filter(reviewee=caregiver)
        average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0  # Default to 0 if no reviews

        # Get the serialized caregiver data
        serializer = self.get_serializer(caregiver)
        caregiver_data = serializer.data

        # Manually add experience categories to the response
        caregiver_data['average_rating'] = average_rating
        caregiver_data['experience_categories'] = ExperienceCategorySerializer(
            caregiver.experience_categories.all(), many=True
        ).data  # Serialize experience categories

        return Response(caregiver_data)



class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Create the serializer with incoming data
        serializer = self.get_serializer(data=request.data)

        # Check if the serializer data is valid
        if serializer.is_valid():
            # Save the user instance first
            user = serializer.save()
            
            # Get experience category IDs from the request data (it should be a list)
            experience_category_ids = request.data.get('experience_categories', [])
            print(f"Received experience categories: {experience_category_ids}")  # Log the received categories

            # If there are experience category IDs provided, add them to the user's profile
            if experience_category_ids:
                # Fetch categories based on the received IDs
                categories = ExperienceCategory.objects.filter(id__in=experience_category_ids)
                print(f"Fetched categories for IDs {experience_category_ids}: {categories}")  # Log fetched categories

                # Add categories to the user instance's many-to-many relationship
                user.experience_categories.set(categories)  # Use .set() to avoid duplicates

            # Return the created user's serialized data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # If the serializer data is not valid, log the errors and return a 400 response
            print("Serializer errors:", serializer.errors)  # Log the errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(ObtainAuthToken):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
         # Determine the role
        if user.is_superuser or user.is_staff:
            role = 'admin'
        elif user.is_care_seeker:
            role = 'care_seeker'
        elif user.is_caregiver:
            role = 'caregiver'
        else:
            role = 'unknown'

        response_data = {
            'token': token.key,
            'user': UserSerializer(user).data,
            'role': role  # Return role explicitly
        }

        print(f"Response data: {response_data}")  # This will print to the console/logs

       
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'role': role  # Return role explicitly
        })
    