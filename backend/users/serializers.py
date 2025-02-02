
from rest_framework import serializers 
from .models import * 
from django.contrib.auth import get_user_model 
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
   class Meta:
      model = User
      fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_image']

   def update(self, instance, validated_data):
      instance.email = validated_data.get('email', instance.email)
      instance.first_name = validated_data.get('first_name', instance.first_name)
      instance.last_name = validated_data.get('last_name', instance.last_name)
      instance.phone_number = validated_data.get('phone_number', instance.phone_number)

      instance.save()
      return instance

class LoginSerializer(serializers.Serializer):
   email = serializers.EmailField()
   password = serializers.CharField()

   def to_representation(self, instance):
      ret = super().to_representation(instance)
      ret.pop('password', None)
      return ret

class RegisterSerializer(serializers.ModelSerializer):
   confirm_password = serializers.CharField(write_only=True)
   profile_image = serializers.ImageField(required=False, allow_null=True)

   class Meta:
      model = User
      fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_image', 'password', 'confirm_password')
      extra_kwargs = {
         'first_name': {'write_only': True},
         'last_name': {'write_only': True},
         'phone_number': {'write_only': True},
         'password': {'write_only': True},
         'confirm_password': {'write_only': True},
      }

   def validate(self, attrs):
      if attrs['password'] != attrs['confirm_password']:
         raise serializers.ValidationError({"password": "Password and Confirm Password do not match."})
      return attrs

   def create(self, validated_data):
      validated_data.pop('confirm_password')
      user = User.objects.create_user(**validated_data)

      # Handle the profile image
      profile_image = validated_data.get('profile_image', None)
      if profile_image:
         user.profile_image = profile_image
         user.save()

      return user

