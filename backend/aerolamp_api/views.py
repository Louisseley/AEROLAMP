from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ESP32Device, AirQualityData
from .serializers import ESP32DeviceSerializer, AirQualityDataSerializer, AirQualityDataCreateSerializer
from django.utils import timezone
from datetime import timedelta, datetime
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

      device, created = ESP32Device.objects.get_or_create(
         mac_address=mac_address, 
         defaults={"device_name": device_name}
      )

      # Add user to the device
      device.user.add(request.user)

      return Response({"message": "Device registered successfully.", "device_id": device.id},
                     status=status.HTTP_201_CREATED)


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
      Calculate the average AQI and pollutant values for each hour.
      """
      device_id = self.kwargs['device_id']
      last_24_hours = timezone.now() - timedelta(hours=24)

      hourly_data = (
         AirQualityData.objects.filter(device_id=device_id, timestamp__gte=last_24_hours)
         .extra(select={'hour': 'EXTRACT(HOUR FROM timestamp)'})
         .values('hour')
         .annotate(
               avg_ozone=Avg('ozone'),
               avg_pm25=Avg('pm25'),
               avg_pm10=Avg('pm10'),
               avg_co=Avg('co'),
               avg_so2=Avg('so2'),
               avg_no2=Avg('no2'),
               avg_aqi=Avg('aqi')
         )
         .order_by('hour')
      )

      formatted_data = [
         {
               'hour': entry['hour'],
               'ozone': round(entry['avg_ozone'], 2) if entry['avg_ozone'] is not None else None,
               'pm25': round(entry['avg_pm25'], 2) if entry['avg_pm25'] is not None else None,
               'pm10': round(entry['avg_pm10'], 2) if entry['avg_pm10'] is not None else None,
               'co': round(entry['avg_co'], 2) if entry['avg_co'] is not None else None,
               'so2': round(entry['avg_so2'], 2) if entry['avg_so2'] is not None else None,
               'no2': round(entry['avg_no2'], 2) if entry['avg_no2'] is not None else None,
               'avg_aqi': round(entry['avg_aqi'], 2) if entry['avg_aqi'] is not None else None
         }
         for entry in hourly_data
      ]

      return Response(formatted_data)

   @action(detail=False, methods=['post'])
   def create_air_quality_data(self, request, *args, **kwargs):
      """
      Receive air quality data from ESP32 and save it with calculated AQI.
      """
      serializer = AirQualityDataCreateSerializer(data=request.data)

      if serializer.is_valid():
         air_quality_data = serializer.save()
         response_serializer = AirQualityDataSerializer(air_quality_data)
         return Response(response_serializer.data, status=status.HTTP_201_CREATED)

      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ViewSet for Monthly History
class AirQualityMonthlyHistoryViewSet(viewsets.ViewSet):
   permission_classes = [IsAuthenticated]

   def list(self, request, device_id=None):
      """
      Get monthly history of air quality data for a specific device in a selected year.
      """
      year = self.request.query_params.get("year", None)
      if not year:
         return Response({"error": "Year is required."}, status=status.HTTP_400_BAD_REQUEST)

      data = (
         AirQualityData.objects.filter(device_id=device_id, timestamp__year=year)
         .values("timestamp__month")
         .annotate(
               avg_ozone=Avg("ozone"),
               avg_pm25=Avg("pm25"),
               avg_pm10=Avg("pm10"),
               avg_co=Avg("co"),
               avg_so2=Avg("so2"),
               avg_no2=Avg("no2")
         )
         .order_by("timestamp__month")
      )

      formatted_data = [
         {
               "month": entry["timestamp__month"],
               "ozone": entry["avg_ozone"],
               "pm25": entry["avg_pm25"],
               "pm10": entry["avg_pm10"],
               "co": entry["avg_co"],
               "so2": entry["avg_so2"],
               "no2": entry["avg_no2"]
         }
         for entry in data
      ]

      return Response(formatted_data)


# ViewSet for Daily History
class AirQualityDailyHistoryViewSet(viewsets.ViewSet):
   permission_classes = [IsAuthenticated]

   def list(self, request, device_id=None):
      """
      Retrieve all air quality data for a specific day.
      Use the query parameter 'date' (format YYYY-MM-DD) to select the day.
      The response also includes 'previous' and 'next' dates that have data.
      """
      date_str = request.query_params.get("date", None)
      distinct_dates = AirQualityData.objects.filter(device_id=device_id)\
                        .dates('timestamp', 'day')\
                        .order_by('timestamp')

      if not distinct_dates:
         return Response({"error": "No data available for this device."},
                           status=status.HTTP_404_NOT_FOUND)

      if date_str:
         try:
               current_date = datetime.strptime(date_str, "%Y-%m-%d").date()
         except ValueError:
               return Response({"error": "Invalid date format. Use YYYY-MM-DD."},
                              status=status.HTTP_400_BAD_REQUEST)
      else:
         current_date = distinct_dates[0]

      start_datetime = datetime.combine(current_date, datetime.min.time())
      end_datetime = datetime.combine(current_date, datetime.max.time())
      day_data = AirQualityData.objects.filter(
         device_id=device_id,
         timestamp__range=(start_datetime, end_datetime)
      ).order_by("timestamp")

      distinct_dates_list = list(distinct_dates)
      try:
         current_index = distinct_dates_list.index(current_date)
      except ValueError:
         current_index = 0
         current_date = distinct_dates_list[0]

      previous_date = distinct_dates_list[current_index - 1] if current_index > 0 else None
      next_date = distinct_dates_list[current_index + 1] if current_index < len(distinct_dates_list) - 1 else None

      serializer = AirQualityDataSerializer(day_data, many=True)
      return Response({
         "date": current_date,
         "data": serializer.data,
         "previous": previous_date,
         "next": next_date
      })
