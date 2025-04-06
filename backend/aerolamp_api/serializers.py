from rest_framework import serializers
from .models import ESP32Device, AirQualityData
from django.contrib.auth import get_user_model

User = get_user_model()

# Serializer for ESP32Device
class ESP32DeviceSerializer(serializers.ModelSerializer):
   user = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

   class Meta:
      model = ESP32Device
      fields = ['id', 'device_name', 'mac_address', 'user']

# Serializer for AirQualityData
class AirQualityDataSerializer(serializers.ModelSerializer):
   aqi_status = serializers.SerializerMethodField()  # Dynamically calculated field

   class Meta:
      model = AirQualityData
      fields = ['id', 'device', 'ozone', 'pm25', 'pm10', 'co', 'so2', 'no2', 'aqi', 'timestamp', 'aqi_status']

   def get_aqi_status(self, obj):
      if obj.aqi is None:
         return "AQI not calculated"
      if obj.aqi <= 50:
         return "Good"
      elif obj.aqi <= 100:
         return "Moderate"
      elif obj.aqi <= 150:
         return "Unhealthy for Sensitive Groups"
      elif obj.aqi <= 200:
         return "Unhealthy"
      elif obj.aqi <= 300:
         return "Very Unhealthy"
      else:
         return "Hazardous"

# Serializer to store Air Quality data via the API
class AirQualityDataCreateSerializer(serializers.Serializer):
   device = serializers.PrimaryKeyRelatedField(queryset=ESP32Device.objects.all())
   ozone = serializers.FloatField()
   pm25 = serializers.FloatField()  # Replace pm with pm25
   pm10 = serializers.FloatField()  # Add pm10
   co = serializers.FloatField()
   so2 = serializers.FloatField()
   no2 = serializers.FloatField()

   def validate(self, data):
      """
      Validate the data to ensure the concentration values for pollutants fall within acceptable ranges.
      """
      if not (0 <= data['ozone'] <= 0.500):
         raise serializers.ValidationError({"ozone": "Ozone concentration out of range."})

      if not (0 <= data['pm25'] <= 500.4):
         raise serializers.ValidationError({"pm25": "PM2.5 concentration out of range."})

      if not (0 <= data['pm10'] <= 500.4):  # Validate pm10
         raise serializers.ValidationError({"pm10": "PM10 concentration out of range."})

      if not (0 <= data['co'] <= 50.4):
         raise serializers.ValidationError({"co": "CO concentration out of range."})

      if not (0 <= data['so2'] <= 1004):
         raise serializers.ValidationError({"so2": "SO2 concentration out of range."})

      if not (0 <= data['no2'] <= 2049):
         raise serializers.ValidationError({"no2": "NO2 concentration out of range."})

      return data

   def create(self, validated_data):
      """
      Create and save the AirQualityData instance with the provided validated data.
      """
      device = validated_data['device']
      ozone = validated_data['ozone']
      pm25 = validated_data['pm25']
      pm10 = validated_data['pm10']
      co = validated_data['co']
      so2 = validated_data['so2']
      no2 = validated_data['no2']

      # Do not calculate AQI here. The AQI will be calculated in `save_air_quality_data` method of the model.
      return AirQualityData.save_air_quality_data(device, ozone, pm25, pm10, co, so2, no2)
