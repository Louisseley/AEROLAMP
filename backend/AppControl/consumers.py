import json
from channels.generic.websocket import AsyncWebsocketConsumer

class RelayConsumer(AsyncWebsocketConsumer):
   async def connect(self):
      self.device_id = self.scope['url_route']['kwargs']['device_id']
      self.group_name = f"device_{self.device_id}"
      
      # Join device group
      await self.channel_layer.group_add(self.group_name, self.channel_name)
      await self.accept()

   async def disconnect(self, close_code):
      await self.channel_layer.group_discard(self.group_name, self.channel_name)

   async def receive(self, text_data):
      data = json.loads(text_data)
      relay_status = data['relay_status']
      
      # Broadcast relay status update to group
      await self.channel_layer.group_send(
         self.group_name, {"type": "relay_update", "relay_status": relay_status}
      )

   async def relay_update(self, event):
      await self.send(text_data=json.dumps({"relay_status": event["relay_status"]}))
