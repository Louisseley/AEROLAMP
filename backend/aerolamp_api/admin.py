from django.contrib import admin
from .models import ESP32Device, AirQualityData

class AirQualityDataInline(admin.TabularInline):
   """
   Inline display of AirQualityData within the ESP32Device admin.
   """
   model = AirQualityData
   extra = 1  # Number of empty forms to show by default
   fields = ('ozone', 'pm25', 'pm10', 'co', 'so2', 'no2')  # Updated to pm25 and pm10
   exclude = ['aqi'] 

class ESP32DeviceAdmin(admin.ModelAdmin):
   """
   Custom Admin interface for the ESP32Device model.
   """
   list_display = ('device_name', 'mac_address')
   search_fields = ('device_name', 'mac_address')
   list_filter = ('user',)
   ordering = ('user',)

   inlines = [AirQualityDataInline]  # Add AirQualityData inline

class AirQualityDataAdmin(admin.ModelAdmin):
   """
   Custom Admin interface for the AirQualityData model.
   """
   list_display = ('device', 'timestamp', 'ozone', 'pm25', 'pm10', 'co', 'so2', 'no2',)  # Updated to pm25 and pm10
   exclude = ['aqi'] 
   list_filter = ('device', 'timestamp')
   search_fields = ('device__device_name', 'timestamp')
   ordering = ('-timestamp',)  # Order by latest timestamp

   # Exclude 'timestamp' field in the form
   exclude = ('timestamp',)

# Register models with custom admin classes
admin.site.register(ESP32Device, ESP32DeviceAdmin)
admin.site.register(AirQualityData, AirQualityDataAdmin)
