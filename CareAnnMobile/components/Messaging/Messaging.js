// src/components/Messaging/Messaging.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Messaging() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://your-backend-api-url/api/messaging/conversations/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations', error);
            }
        };

        fetchConversations();
    }, []);

    const fetchMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://your-backend-api-url/api/messaging/conversations/${conversationId}/messages/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setMessages(response.data);
            setSelectedConversation(conversationId);
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://your-backend-api-url/api/messaging/conversations/${selectedConversation}/messages/`, {
                content: newMessage,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            setMessages([...messages, { content: newMessage, sender: 'You' }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    return (
        <div className="messaging-container">
            <h2>Messaging</h2>
            <div className="conversations-list">
                <h3>Conversations</h3>
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation.id} onClick={() => fetchMessages(conversation.id)}>
                            Conversation with {conversation.participants.join(', ')}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="messages-list">
                <h3>Messages</h3>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>{message.sender}:</strong> {message.content}
                        </li>
                    ))}
                </ul>
                {selectedConversation && (
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messaging;
