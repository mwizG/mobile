# In messaging/routing.py

from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/messaging/<conversation_id>/', ChatConsumer.as_asgi()),
]
