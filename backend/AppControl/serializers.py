from rest_framework import serializers
from .models import RelayControl

class RelayControlSerializer(serializers.ModelSerializer):
   class Meta:
      model = RelayControl
      fields = '__all__'
