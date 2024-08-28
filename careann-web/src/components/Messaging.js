// src/components/Messaging.js
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/Api';

function Messaging() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await apiGet('/messaging/conversations/', token);
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };
    fetchConversations();
  }, [token]);

  const fetchMessages = async (conversationId) => {
    try {
      const data = await apiGet(`/messaging/conversations/${conversationId}/messages/`, token);
      setMessages(data);
      setSelectedConversation(conversationId);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleSendMessage = async () => {
    try {
      await apiPost(`/messaging/conversations/${selectedConversation}/messages/`, { content: newMessage }, token);
      setMessages([...messages, { content: newMessage, sender: 'You' }]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="messaging-container">
      <h2>Messaging</h2>
      <div className="conversations-list">
        <h3>Conversations</h3>
        {conversations.map((conversation) => (
          <div key={conversation.id} onClick={() => fetchMessages(conversation.id)}>
            <p>Conversation with {conversation.participants.join(', ')}</p>
          </div>
        ))}
      </div>
      <div className="messages-list">
        <h3>Messages</h3>
        {messages.map((message, index) => (
          <p key={index}>{message.sender}: {message.content}</p>
        ))}
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
