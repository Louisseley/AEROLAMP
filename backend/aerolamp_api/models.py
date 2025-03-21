from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# US EPA Pollutant breakpoints
OZONE_BREAKPOINTS = [(0.000, 0), (0.054, 50), (0.070, 100), (0.085, 150), (0.105, 200), (0.200, 300), (0.405, 400), (0.505, 500)]
PM25_BREAKPOINTS = [(0.0, 0), (12.0, 50), (35.4, 100), (55.4, 150), (150.4, 200), (250.4, 300), (350.4, 400), (500.4, 500)]
CO_BREAKPOINTS = [(0.0, 0), (4.4, 50), (9.4, 100), (12.4, 150), (15.4, 200), (30.4, 300), (40.4, 400), (50.4, 500)]
SO2_BREAKPOINTS = [(0, 0), (35, 50), (75, 100), (185, 150), (304, 200), (604, 300), (804, 400), (1004, 500)]
NO2_BREAKPOINTS = [(0, 0), (53, 50), (100, 100), (360, 150), (649, 200), (1249, 300), (1649, 400), (2049, 500)]


def calculate_aqi(concentration, breakpoints):
   """
   Computes AQI for a given pollutant based on its concentration and breakpoint table.
   """
   for i in range(len(breakpoints) - 1):
      C_low, C_high = breakpoints[i][0], breakpoints[i + 1][0]
      I_low, I_high = breakpoints[i][1], breakpoints[i + 1][1]

      if C_low <= concentration <= C_high:
         return round(((I_high - I_low) / (C_high - C_low)) * (concentration - C_low) + I_low)

   return 500  # Return max AQI if above range


def calculate_air_quality_index(ozone, pm, co, so2, no2):
   """
   Computes AQI based on multiple pollutants using US EPA AQI standards.
   """
   aqi_values = [
      calculate_aqi(ozone, OZONE_BREAKPOINTS),
      calculate_aqi(pm, PM25_BREAKPOINTS),
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
   pm = models.FloatField()  # µg/m³
   co = models.FloatField()  # ppm
   so2 = models.FloatField()  # ppb
   no2 = models.FloatField()  # ppb
   aqi = models.IntegerField(editable=False)  # AQI score will be calculated automatically

   def __str__(self):
      return f"Data from {self.device.device_name} at {self.timestamp}"

   def save(self, *args, **kwargs):
      # Automatically calculate AQI before saving
      self.aqi = calculate_air_quality_index(self.ozone, self.pm, self.co, self.so2, self.no2)
      super().save(*args, **kwargs)  # Call the original save method
