import os
import django

# Set the default settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careann_backend.settings')

# Ensure Django apps are loaded before using any ORM-related features
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from messaging.routing import websocket_urlpatterns  # Import your routing here
from messaging.middleware import TokenAuthMiddleware  # Import the middleware

# Define the application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(  # Use your custom middleware here
            AuthMiddlewareStack(
                URLRouter(
                    websocket_urlpatterns
                )
            )
        )
    ),
})

