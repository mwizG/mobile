from django.urls import path
from .views import ConversationListView, MessageListView,CaregiverListView

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('caregivers/', CaregiverListView.as_view(), name='caregiver-list'),
]