from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract token from query string
        query_string = scope['query_string'].decode()
        params = parse_qs(query_string)
        token_key = params.get('token', [None])[0]

        # Check if token is provided
        if token_key:
            try:
                # Fetch the token object asynchronously
                token = await sync_to_async(Token.objects.get)(key=token_key)
                
                # Fetch the user associated with the token asynchronously
                scope['user'] = await sync_to_async(self.get_user)(token)
            except Token.DoesNotExist:
                scope['user'] = AnonymousUser()  # Invalid token, set user to AnonymousUser
        else:
            scope['user'] = AnonymousUser()  # No token provided, set user to AnonymousUser

        return await super().__call__(scope, receive, send)

    def get_user(self, token):
        return token.user  # This function runs synchronously, so it can directly access the token's user
