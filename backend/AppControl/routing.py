from django.urls import re_path
from .consumers import RelayConsumer

websocket_urlpatterns = [
   re_path(r'ws/relay/(?P<device_id>\d+)/$', RelayConsumer.as_asgi()),
]
