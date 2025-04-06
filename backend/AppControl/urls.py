from django.urls import path
from .views import get_relay_status, set_relay_status

urlpatterns = [
   path('device/<int:device_id>/relay-status/', get_relay_status),
   path('device/<int:device_id>/set-relay/', set_relay_status),  # Include device_id in URL
]