from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from knox.auth import TokenAuthentication  # Use Knox Authentication
from rest_framework.permissions import IsAuthenticated
from .models import RelayControl
from .serializers import RelayControlSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@api_view(['GET'])
@authentication_classes([TokenAuthentication])  # Knox Token Auth
@permission_classes([IsAuthenticated])
def get_relay_status(request, device_id):
   try:
      device = RelayControl.objects.get(device_id=device_id)
      return Response({"relay_status": device.relay_status})
   except RelayControl.DoesNotExist:
      return Response({"relay_status": "OFF"}, status=404)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])  # Knox Token Auth
@permission_classes([IsAuthenticated])
def set_relay_status(request, device_id):  
   try:
      relay_status = request.data.get("relay_status")  

      # Update or create relay status for the given device_id
      device, created = RelayControl.objects.update_or_create(
         device_id=device_id,  
         defaults={"relay_status": relay_status},
      )

      # Send real-time WebSocket message
      channel_layer = get_channel_layer()
      async_to_sync(channel_layer.group_send)(
         f"device_{device_id}", {"type": "relay_update", "relay_status": relay_status}
      )

      return Response({"message": "Relay updated", "relay_status": device.relay_status})
   except Exception as e:
      return Response({"error": str(e)}, status=400)

