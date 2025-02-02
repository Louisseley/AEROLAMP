from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginViewset, RegisterViewset, UserProfileView
from django.conf import settings
from django.conf.urls.static import static
router = DefaultRouter()
router.register('login', LoginViewset, basename='login')
router.register('register', RegisterViewset, basename='register')

urlpatterns = [
   path('', include(router.urls)),
   path('profile/', UserProfileView.as_view({'get': 'list', 'put': 'update', 'patch': 'partial_update'}), name='profile'),
] 
