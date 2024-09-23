import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Messaging = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);

    // Fetch conversations when component mounts
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setConversations(response.data);

                // Check if there's a saved conversation ID in localStorage
                const savedConversationId = localStorage.getItem('selectedConversation');
                if (savedConversationId) {
                    fetchMessages(savedConversationId);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, []);
     // Fetch messages for the selected conversation with polling
    
    // Fetch messages for the selected conversation
    const fetchMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/api/messaging/conversations/${conversationId}/messages/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setMessages(response.data);
            setSelectedConversation(conversationId);

            // Save the selected conversation ID to localStorage
            localStorage.setItem('selectedConversation', conversationId);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
     
    useEffect(() => {
        if (selectedConversation) {
            // Polling every 5 seconds for new messages
            const intervalId = setInterval(() => {
                fetchMessages(selectedConversation);
            }, 5000); // 5000ms = 5 seconds
    
            return () => clearInterval(intervalId); // Clean up on unmount
        }
    }, [selectedConversation]);

    // Scroll to the bottom of the messages when a new message is received
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const messageData = {
                content: newMessage,
                conversation: selectedConversation,
            };

            await axios.post(
                `http://127.0.0.1:8000/api/messaging/conversations/${selectedConversation}/messages/`,
                messageData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setNewMessage('');
            fetchMessages(selectedConversation); // Refresh messages
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
        }
    };

    return (
        <div className="messaging-container" style={{ display: 'flex', height: '100vh' }}>
            <div className="conversation-list" style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
                <h2>Your Conversations</h2>
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation.id}>
                            <button onClick={() => fetchMessages(conversation.id)}>
                                Conversation with {conversation.participants.join(', ')}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="message-area" style={{ flex: 2, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                {selectedConversation ? (
                    <>
                        <h2>Messages</h2>
                        <div className="message-list" style={{ flex: 1, overflowY: 'auto' }}>
                            {messages.length === 0 ? (
                                <p>No messages yet.</p>
                            ) : (
                                <ul>
                                    {messages.map((message) => (
                                        <li key={message.id} style={{ margin: '10px 0' }}>
                                            <strong>{message.sender}:</strong> {message.content}
                                        </li>
                                    ))}
                                    <div ref={messageEndRef}></div>
                                </ul>
                            )}
                        </div>
                        <div className="message-input" style={{ display: 'flex', marginTop: '10px' }}>
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            <button onClick={handleSendMessage} style={{ marginLeft: '10px', padding: '10px 20px' }}>
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Select a conversation to view messages</p>
                )}
            </div>
        </div>
    );
}

export default Messaging;
