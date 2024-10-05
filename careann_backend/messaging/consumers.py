import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'messaging_{self.conversation_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

async def receive(self, text_data):
    try:
        # Log the raw text data received
        print(f"Raw text data received: {text_data}")
        
        data = json.loads(text_data)
        content = data.get('content', '')
        conversation_id = data.get('conversation', None)

        if not content or conversation_id is None:
            print("Error: Missing content or conversation ID.")
            return  # Ignore messages without content or conversation ID

        # Log received message
        print(f"Received message: {content} in conversation {conversation_id}")

        # Handle saving the message and broadcasting it
        conversation = await self.get_conversation(conversation_id)
        sender = await self.get_user(self.scope['user'].username)
        message = await self.save_message(conversation, sender, content)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'content': message.content,
                'sender': sender.username,
            }
        )
    except json.JSONDecodeError:
        print("Error: Invalid JSON received.")
    except ObjectDoesNotExist as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
    except KeyError as e:
        print(f"Error: Missing key in message data: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")



    async def chat_message(self, event):
        content = event['content']
        sender = event['sender']

        # Send message to WebSocket
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
