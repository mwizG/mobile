# In accounts/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import CertificationSerializer, ExperienceCategorySerializer, UserSerializer, RegisterSerializer, LoginSerializer
from . models import Certification, CustomUser,CaregiverFilter, ExperienceCategory
from django_filters.rest_framework import DjangoFilterBackend
from jobs.models import RatingReview
from django.db.models import Avg,Q
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction

class CaregiverSearchView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(is_caregiver=True)
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CaregiverFilter


class UploadCredentialsView(generics.CreateAPIView):
    serializer_class = CertificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Save the certification with the associated user
        serializer.save(user=self.request.user)
        

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Enable file handling for certification uploads

    def get_object(self):
        # Returns the currently authenticated user
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        print('Serialized data:', serializer.data)
        return Response(serializer.data)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        updated_data = request.data.copy()

        # Handling certifications upload
        if 'certifications' in request.FILES:
            certification_files = request.FILES.getlist('certifications')
            Certification.objects.filter(user=user).delete()  # Optionally delete old certifications

            for file in certification_files:
                # Extracting the document type from the filename or based on user input
                document_type = file.name.split('.')[-1]  # e.g., pdf, cv, etc.
                Certification.objects.create(user=user, file=file, name=file.name, document_type=document_type)

        # Include caregiver status if it's not provided in the request
        updated_data['is_caregiver'] = updated_data.get('is_caregiver', user.is_caregiver)
        updated_data['is_care_seeker'] = updated_data.get('is_care_seeker', user.is_care_seeker)

        # Pass the updated data to the serializer
        serializer = self.get_serializer(user, data=updated_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Handle file uploads for certifications only if they are provided in the request
        if 'certifications' in request.FILES:
            certification_files = request.FILES.getlist('certifications')

            # Log the certification files to be uploaded
            print('Certification files:', certification_files)

            # Delete old certifications if necessary or handle them as needed
            Certification.objects.filter(user=user).delete()

            # Create new certification instances
            for file in certification_files:
                Certification.objects.create(user=user, file=file, name=file.name)

        # Log the response data after the update
        print('Updated data:', serializer.data)

        return Response(serializer.data)

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

            # Manually add average rating to the response
            caregiver_data['average_rating'] = average_rating

            # Serialize experience categories to avoid non-serializable objects
            experience_categories = []
            
            if caregiver.experience_cat1:
                experience_categories.append(str(caregiver.experience_cat1))  # Assuming it's a model instance
            if caregiver.experience_cat2:
                experience_categories.append(str(caregiver.experience_cat2))
            if caregiver.experience_cat3:
                experience_categories.append(str(caregiver.experience_cat3))

            caregiver_data['experience_categories'] = experience_categories

            return Response(caregiver_data)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # Check if the serializer data is valid
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=201)
        else:
            # If the serializer data is not valid, log the errors and return a 400 response
            print("Serializer errors:", serializer.errors)  # Log the errors for debugging
            return Response(serializer.errors, status=400)
        

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
 



class CaregiverByJobTypeView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_type = self.kwargs['serviceType'].replace('-', ' ')  # Convert to match the database entry

        # Print out the job_type for debugging
        print(f'Job Type to Filter: "{job_type}"')

        queryset = CustomUser.objects.filter(
            is_caregiver=True
        ).filter(
            Q(experience_cat1__job_type__iexact=job_type) |  # Use iexact for case-insensitive comparison
            Q(experience_cat2__job_type__iexact=job_type) |
            Q(experience_cat3__job_type__iexact=job_type)  # Check all experience categories
        )

        # Print out the queryset for debugging
        print(f'Queryset for job_type "{job_type}": {queryset}')  
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        print(f'Serialized data before adding ratings and experience categories: {serializer.data}')  # Print serialized data

        # Prepare response data with average ratings and experience categories
        response_data = []
        for caregiver_data in serializer.data:
            caregiver_id = caregiver_data['id']
            reviews = RatingReview.objects.filter(reviewee_id=caregiver_id)
            average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
            caregiver_data['average_rating'] = average_rating

            # Serialize experience categories
            experience_categories = []
            caregiver = queryset.get(id=caregiver_id)  # Get the full caregiver instance
            if caregiver.experience_cat1:
                experience_categories.append(str(caregiver.experience_cat1))
            if caregiver.experience_cat2:
                experience_categories.append(str(caregiver.experience_cat2))
            if caregiver.experience_cat3:
                experience_categories.append(str(caregiver.experience_cat3))

            caregiver_data['experience_categories'] = experience_categories
            response_data.append(caregiver_data)  # Collect the updated caregiver data

        print(f'Response data: {response_data}')  # Print final response data

        return Response(response_data)  # Return the modified response data