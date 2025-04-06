from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'devices', views.ESP32DeviceViewSet, basename='device')
router.register(r'devices/(?P<device_id>\d+)/air-quality', views.AirQualityDataViewSet, basename='air-quality')
router.register(r'devices/(?P<device_id>\d+)/air-quality-history', views.AirQualityMonthlyHistoryViewSet, basename='air-quality-history')
router.register(r'devices/(?P<device_id>\d+)/air-quality-daily-history', views.AirQualityDailyHistoryViewSet, basename='air-quality-daily-history')

urlpatterns = [
    path('', include(router.urls)),
]
