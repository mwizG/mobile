import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import messaging.routing  # Import your routing here to ensure it's accessible.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careann_backend.settings')

# Ensure Django apps are loaded before using any ORM-related features
import django
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            messaging.routing.websocket_urlpatterns
        )
    ),
})
