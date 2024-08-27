# In messaging/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Conversation, Message
from accounts.models import CustomUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.conversation_group_name = f'conversation_{self.conversation_id}'

        # Join conversation group
        await self.channel_layer.group_add(
            self.conversation_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave conversation group
        await self.channel_layer.group_discard(
            self.conversation_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_username = data['sender']
        sender = CustomUser.objects.get(username=sender_username)

        # Save message to the database
        conversation = Conversation.objects.get(id=self.conversation_id)
        message_obj = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message
        )

        # Send message to conversation group
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_username
            }
        )

    # Receive message from conversation group
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))
