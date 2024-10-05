from django.db import models

class Conversation(models.Model):
    participants = models.ManyToManyField('accounts.CustomUser', related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation between {', '.join([p.username for p in self.participants.all()])}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)  # Use string reference
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)  # Tracks whether the message has been read

    def __str__(self):
        return f"Message from {self.sender.username} in conversation {self.conversation.id}"
