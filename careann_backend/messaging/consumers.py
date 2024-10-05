from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import TokenError
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'messaging_{self.conversation_id}'

        # Retrieve token from the URL parameters
        query_string = self.scope['query_string'].decode()
        self.token = self.extract_token_from_query(query_string)

        # Retrieve user ID from request data (for comparison)
        self.user_id_from_request = self.scope['user'].id if self.scope['user'].is_authenticated else None

        # Retrieve user from token
        self.user = await self.get_user_from_token(self.token)

        if self.user is None:
            print("Invalid user token. Closing connection.")
            await self.close()
            return

        # Print user ID comparison
        print(f"User ID from request data: {self.user_id_from_request}")
        print(f"User ID from token: {self.user.id}")
        
        if self.user_id_from_request != self.user.id:
            print(f"User ID mismatch: Request User ID {self.user_id_from_request} does not match Token User ID {self.user.id}. Closing connection.")
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print(f"User connected to conversation: {self.conversation_id}")
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"User disconnected from conversation: {self.conversation_id}")

    async def receive(self, text_data):
        try:
            print(f"Raw text data received: {text_data}")

            data = json.loads(text_data)
            content = data.get('content', '')
            conversation_id = data.get('conversation', None)

            if not content or conversation_id is None:
                print("Error: Missing content or conversation ID.")
                return

            print(f"Received message: {content} in conversation {conversation_id}")

            conversation = await self.get_conversation(conversation_id)
            message = await self.save_message(conversation, self.user, content)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'content': message.content,
                    'sender': self.user.username,
                }
            )
        except json.JSONDecodeError:
            print("Error: Invalid JSON received.")
        except ObjectDoesNotExist as e:
            print(f"Error: {str(e)}")
        except KeyError as e:
            print(f"Error: Missing key in message data: {str(e)}")
        except Exception as e:
            print(f"Unexpected error: {str(e)}")

    async def chat_message(self, event):
        content = event['content']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'content': content,
            'sender': sender,
        }))

    # Helper methods
    @database_sync_to_async
    def get_user(self, username):
        from accounts.models import CustomUser
        return CustomUser.objects.get(username=username)

    @database_sync_to_async
    def get_user_from_token(self, token):
        from accounts.models import CustomUser
        try:
            print(f"Validating token: {token}")
            validated_token = UntypedToken(token)
            user_id = validated_token['user_id']
            print(f"Decoded user ID from token: {user_id}")

            # Log the comparison
            print(f"Comparing user ID: {self.user.id} with token user ID: {user_id}")
            if self.user.id != user_id:
                print(f"User ID mismatch: {self.user.id} (from request) != {user_id} (from token)")
                return None

            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            print(f"User with ID {user_id} does not exist.")
            return None
        except TokenError as e:
            print(f"Token error: {str(e)}")
            return None
        except Exception as e:
            print(f"Unexpected error retrieving user from token: {str(e)}")
            return None


    @database_sync_to_async
    def get_conversation(self, conversation_id):
        from .models import Conversation
        return Conversation.objects.get(id=conversation_id)

    @database_sync_to_async
    def save_message(self, conversation, sender, message):
        from .models import Message
        return Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message
        )

    def extract_token_from_query(self, query_string):
        """Extract token from the query string."""
        token_param = 'token='
        if token_param in query_string:
            return query_string.split(token_param)[-1]
        print("No token found in query string.")
        return None
