from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from knox.models import AuthToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from knox.auth import TokenAuthentication

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
               # Create token for user
               _, token = AuthToken.objects.create(user)
               user_profile_data = UserSerializer(user).data
               
               # Prepare response data including token and redirect_url
               response_data = {
                  "user": user_profile_data,
                  "token": token,
               }
               return Response(response_data, status=status.HTTP_200_OK)
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
         return Response({
               "user": UserSerializer(user).data,
               "token": token
         }, status=status.HTTP_201_CREATED)

      # Log validation errors
      print(serializer.errors)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(viewsets.ViewSet):
   authentication_classes = [TokenAuthentication]  # Ensure Knox Authentication is used
   permission_classes = [permissions.IsAuthenticated]
   parser_classes = (MultiPartParser, FormParser)

   def list(self, request):
      """Allow authentication using a query parameter token"""
      token_param = request.GET.get("token")  # Get token from URL
      if not token_param:
         return Response({"error": "Token is required in the URL"}, status=status.HTTP_401_UNAUTHORIZED)

      auth_token = AuthToken.objects.filter(digest=token_param).first()
      if not auth_token:
         return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

      user = auth_token.user
      return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
   
   def retrieve(self, request, pk=None):
      """Retrieve the current user's profile"""
      return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)

   def update(self, request):
      """Update the full profile"""
      serializer = UserSerializer(request.user, data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response({
               "message": "Profile updated successfully!", 
               "user": serializer.data
         }, status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   def partial_update(self, request):
      """Partially update the user's profile (e.g., email, phone number)"""
      serializer = UserSerializer(request.user, data=request.data, partial=True)
      if serializer.is_valid():
         serializer.save()
         return Response({
               "message": "Profile updated successfully!", 
               "user": serializer.data
         }, status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

