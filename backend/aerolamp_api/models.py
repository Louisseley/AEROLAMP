from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# US EPA Pollutant breakpoints
OZONE_BREAKPOINTS = [(0.000, 0), (0.054, 50), (0.070, 100), (0.085, 150), (0.105, 200), (0.200, 300), (0.405, 400), (0.505, 500)]
PM25_BREAKPOINTS = [(0.0, 0), (12.0, 50), (35.4, 100), (55.4, 150), (150.4, 200), (250.4, 300), (350.4, 400), (500.4, 500)]
PM10_BREAKPOINTS = [(0.0, 0), (54.0, 50), (154.0, 100), (254.0, 150), (354.0, 200), (424.0, 300), (504.0, 400), (604.0, 500)]
CO_BREAKPOINTS = [(0.0, 0), (4.4, 50), (9.4, 100), (12.4, 150), (15.4, 200), (30.4, 300), (40.4, 400), (50.4, 500)]
SO2_BREAKPOINTS = [(0, 0), (36, 50), (76, 100), (186, 150), (305, 200), (605, 300), (805, 400), (1005, 500)]
NO2_BREAKPOINTS = [(0, 0), (54, 50), (101, 100), (361, 150), (650, 200), (1250, 300), (1650, 400), (2050, 500)]

def calculate_aqi(concentration, breakpoints):
   """
   Computes AQI for a given pollutant based on its concentration and breakpoint table.
   """
   # If concentration is below the first breakpoint, return the lowest AQI
   if concentration < breakpoints[0][0]:
      return breakpoints[0][1]

   # Iterate through breakpoints to find the correct range
   for i in range(len(breakpoints) - 1):
      C_low, C_high = breakpoints[i][0], breakpoints[i + 1][0]
      I_low, I_high = breakpoints[i][1], breakpoints[i + 1][1]

      if C_low <= concentration <= C_high:
         return round(((I_high - I_low) / (C_high - C_low)) * (concentration - C_low) + I_low)

   # If concentration exceeds the highest breakpoint, return 500 (max AQI)
   return 500 

def calculate_air_quality_index(ozone, pm25, pm10, co, so2, no2):
   """
   Computes AQI based on multiple pollutants using US EPA AQI standards.
   """
   aqi_values = [
      calculate_aqi(ozone, OZONE_BREAKPOINTS),
      calculate_aqi(pm25, PM25_BREAKPOINTS),
      calculate_aqi(pm10, PM10_BREAKPOINTS),
      calculate_aqi(co, CO_BREAKPOINTS),
      calculate_aqi(so2, SO2_BREAKPOINTS),
      calculate_aqi(no2, NO2_BREAKPOINTS),
   ]

   return max(aqi_values)  # AQI is determined by the highest pollutant AQI


# Model for storing ESP32 devices
class ESP32Device(models.Model):
   user = models.ManyToManyField(User, related_name='devices')
   device_name = models.CharField(max_length=100)
   mac_address = models.CharField(max_length=50, unique=True)  # Unique identifier

   def __str__(self):
      return f"{self.device_name} ({self.mac_address})"

# Model for storing Air Quality Data with auto AQI calculation
class AirQualityData(models.Model):
   device = models.ForeignKey(ESP32Device, on_delete=models.CASCADE, related_name='air_data')
   timestamp = models.DateTimeField(default=timezone.now)  # Timezone-aware timestamp
   ozone = models.FloatField()  # ppm
   pm25 = models.FloatField(default=0.0)  # µg/m³ with a default value
   pm10 = models.FloatField(default=0.0)  # µg/m³ with a default value
   co = models.FloatField()  # ppm
   so2 = models.FloatField()  # ppb
   no2 = models.FloatField()  # ppb
   aqi = models.IntegerField(editable=False)  # AQI score will be calculated automatically


   def __str__(self):
      return f"Data from {self.device.device_name} at {self.timestamp}"

   def save(self, *args, **kwargs):
      # Automatically calculate AQI before saving
      self.aqi = calculate_air_quality_index(self.ozone, self.pm25, self.pm10, self.co, self.so2, self.no2)
      super().save(*args, **kwargs)  # Call the original save method
