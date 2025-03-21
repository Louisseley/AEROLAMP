from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ESP32Device, AirQualityData
from .serializers import ESP32DeviceSerializer, AirQualityDataSerializer, AirQualityDataCreateSerializer
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg

# ViewSet for ESP32Device
class ESP32DeviceViewSet(viewsets.ModelViewSet):
   permission_classes = [IsAuthenticated]
   serializer_class = ESP32DeviceSerializer

   def get_queryset(self):
      """
      Return ESP32 devices associated with the authenticated user.
      """
      return ESP32Device.objects.filter(user=self.request.user)

   @action(detail=False, methods=['post'])
   def register_device(self, request):
      """
      Allows a user to register an ESP32 device using a MAC address.
      If the device already exists, the user is added to it.
      """
      mac_address = request.data.get('mac_address')
      device_name = request.data.get('device_name')

      if not mac_address:
         return Response({"error": "MAC address is required."}, status=status.HTTP_400_BAD_REQUEST)

      device, created = ESP32Device.objects.get_or_create(mac_address=mac_address, defaults={"device_name": device_name})

      # Add user to the device
      device.users.add(request.user)

      return Response({"message": "Device registered successfully.", "device_id": device.id}, status=status.HTTP_201_CREATED)


# ViewSet for AirQualityData

class AirQualityDataViewSet(viewsets.ModelViewSet):
   permission_classes = [IsAuthenticated]
   serializer_class = AirQualityDataSerializer

   def get_queryset(self):
      """
      Filter the queryset to only return the last 24 hours of air quality data.
      """
      device_id = self.kwargs['device_id']
      last_24_hours = timezone.now() - timedelta(hours=24)
      return AirQualityData.objects.filter(device_id=device_id, timestamp__gte=last_24_hours).order_by('timestamp')

   @action(detail=False, methods=['get'], url_path='hourly-average')
   def hourly_average(self, request, *args, **kwargs):
      """
      Calculate the average AQI and pollutants for each hour.
      """
      device_id = self.kwargs['device_id']
      last_24_hours = timezone.now() - timedelta(hours=24)

      # Query for the last 24 hours of data and group by hour
      hourly_data = (
         AirQualityData.objects.filter(device_id=device_id, timestamp__gte=last_24_hours)
         .extra(select={'hour': 'EXTRACT(HOUR FROM timestamp)'}).values('hour')
         .annotate(
            avg_ozone=Avg('ozone'),
            avg_pm=Avg('pm'),
            avg_co=Avg('co'),
            avg_so2=Avg('so2'),
            avg_no2=Avg('no2'),
            avg_aqi=Avg('aqi')
         )
         .order_by('hour')
      )

      # Format the data to return it in the desired structure, converting timestamps to local time
      formatted_data = [
         {
            'hour': entry['hour'],
            'ozone': round(entry['avg_ozone'], 2),
            'pm': round(entry['avg_pm'], 2),
            'co': round(entry['avg_co'], 2),
            'so2': round(entry['avg_so2'], 2),
            'no2': round(entry['avg_no2'], 2),
            'avg_aqi': round(entry['avg_aqi'], 2)
         }
         for entry in hourly_data
      ]

      # Ensure time is in the local timezone
      for entry in formatted_data:
         entry['hour'] = timezone.localtime(timezone.now()).hour  # Adjust hour to local timezone if needed

      return Response(formatted_data)

   # Custom action for creating air quality data and calculating AQI
   @action(detail=False, methods=['post'])
   def create_air_quality_data(self, request, *args, **kwargs):
      """
      Receive air quality data from ESP32 and save it with calculated AQI.
      """
      # Use the AirQualityDataCreateSerializer to validate the input data
      serializer = AirQualityDataCreateSerializer(data=request.data)
      
      if serializer.is_valid():
         # This will use the save_air_quality_data method to calculate AQI and save the data
         air_quality_data = serializer.save()
         
         # Serialize the saved air quality data to return the response
         response_serializer = AirQualityDataSerializer(air_quality_data)
         return Response(response_serializer.data, status=status.HTTP_201_CREATED)
      
      # Return validation errors if serializer is invalid
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ViewSet for AirQualityData History (monthly)
class AirQualityMonthlyHistoryViewSet(viewsets.ViewSet):
   permission_classes = [IsAuthenticated]

   def list(self, request, device_id=None):
      """
      Get monthly history of air quality data for a specific device in a selected year.
      """
      year = self.request.query_params.get("year", None)
      
      if not year:
         return Response({"error": "Year is required."}, status=status.HTTP_400_BAD_REQUEST)

      # Default pollutants
      pollutants = ["ozone", "pm", "co", "so2", "no2"]

      # Query for the whole year grouped by month
      data = (
         AirQualityData.objects.filter(device_id=device_id, timestamp__year=year)
         .values("timestamp__month")
         .annotate(
            avg_ozone=Avg("ozone"),
            avg_pm=Avg("pm"),
            avg_co=Avg("co"),
            avg_so2=Avg("so2"),
            avg_no2=Avg("no2")
         )
         .order_by("timestamp__month")
      )

      # Convert to JSON response
      formatted_data = [
         {
            "month": entry["timestamp__month"],
            "ozone": entry["avg_ozone"],
            "pm": entry["avg_pm"],
            "co": entry["avg_co"],
            "so2": entry["avg_so2"],
            "no2": entry["avg_no2"]
         }
         for entry in data
      ]

      return Response(formatted_data)
