from django.db import models

class RelayControl(models.Model):
   device_id = models.IntegerField(unique=True)
   relay_status = models.CharField(max_length=5, choices=[("ON", "ON"), ("OFF", "OFF")])

   def __str__(self):
      return f"Device {self.device_id} - Relay {self.relay_status}"
