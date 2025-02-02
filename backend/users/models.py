from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver 
from django.urls import reverse 
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
# Create your models here.

#This will set the email as username
class CustomUserManager(BaseUserManager): 
   def create_user(self, email, password=None,first_name=None, last_name=None, phone_number=None, **extra_fields ): 
      if not email: 
         raise ValueError('Email is a required field')
      if not first_name:
         raise ValueError('First name is a required field')
      if not last_name:
         raise ValueError('Last name is a required field')
      
      email = self.normalize_email(email)
      user = self.model(
               email=email, 
               first_name=first_name,
               last_name=last_name,
               phone_number=phone_number, 
               **extra_fields)
      user.set_password(password)
      user.save(using=self._db)
      return user

   def create_superuser(self, email, password=None, first_name=None, last_name=None, phone_number=None, **extra_fields): 
      extra_fields.setdefault('is_staff', True)
      extra_fields.setdefault('is_superuser', True)
      return self.create_user(
         email, 
         password, 
         first_name=first_name, 
         last_name=last_name, 
         phone_number=phone_number, 
         **extra_fields
      )
   
class Customuser(AbstractUser):
   username = models.CharField(max_length=200, null=True, blank=True)
   email = models.CharField(max_length=200, unique=True)
   first_name = models.CharField(max_length=50, blank=True, null=True)
   last_name = models.CharField(max_length=50, blank=True, null=True)
   phone_number = models.CharField(max_length=15, blank=True, null=True)
   active = models.BooleanField(default=False)
   profile_image = models.ImageField(upload_to="images/", blank=True, null=True)

   objects = CustomUserManager()

   USERNAME_FIELD = 'email'
   REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

   def __str__(self):
      return self.email
   
@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
   sitelink = "http://localhost:5173/"
   token = "{}".format(reset_password_token.key)
   full_link = str(sitelink)+str("password-reset/")+str(token)

   print(token)
   print(full_link)

   context = {
      'full_link': full_link,
      'email_adress': reset_password_token.user.email
   }

   html_message = render_to_string("backend/email.html", context=context)
   plain_message = strip_tags(html_message)

   msg = EmailMultiAlternatives(
      subject = "Request for resetting password for {title}".format(title=reset_password_token.user.email), 
      body=plain_message,
      from_email = "igopako3212@gmail.com", 
      to=[reset_password_token.user.email]
   )

   msg.attach_alternative(html_message, "text/html")
   msg.send()