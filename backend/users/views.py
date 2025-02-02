from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
User = get_user_model()

class LoginViewset(viewsets.ViewSet):
   permission_classes = [AllowAny]
   serializer_class = LoginSerializer

   def create(self, request):
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid():
         email = serializer.validated_data['email']
         password = serializer.validated_data['password']
         user = authenticate(request, email=email, password=password)

         if user and user.is_active:
               _, token = AuthToken.objects.create(user)
               user_profile_data = UserSerializer(user).data
               return Response({
                  "user": user_profile_data,
                  "token": token
               })
         else:
               return Response({"error": "Invalid credentials or inactive account"}, status=status.HTTP_401_UNAUTHORIZED)

      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterViewset(viewsets.ViewSet):
   permission_classes = [AllowAny]
   serializer_class = RegisterSerializer

   def create(self, request):
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid():
         user = serializer.save()
         _, token = AuthToken.objects.create(user)
         return Response({"user": UserSerializer(user).data, "token": token}, status=status.HTTP_201_CREATED)
      
      # Log validation errors
      print(serializer.errors)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(viewsets.ViewSet):
   permission_classes = [permissions.IsAuthenticated]
   authentication_classes = [TokenAuthentication]
   parser_classes = (MultiPartParser, FormParser)

   def list(self, request):
      """Get the current user's profile"""
      return Response(UserSerializer(request.user).data)

   def retrieve(self, request):
      """Retrieve the current user's profile"""
      return Response(UserSerializer(request.user).data)

   def update(self, request):
      """Update the full profile"""
      serializer = UserSerializer(request.user, data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response({"message": "Profile updated successfully!", "user": serializer.data})
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   def partial_update(self, request):
      """Partially update the user's profile (e.g., email, phone number)"""
      serializer = UserSerializer(request.user, data=request.data, partial=True)
      if serializer.is_valid():
         serializer.save()
         return Response({"message": "Profile updated successfully!", "user": serializer.data})
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
