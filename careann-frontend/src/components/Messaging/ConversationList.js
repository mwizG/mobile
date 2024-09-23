import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ConversationList() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // For navigation

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');  // Retrieve token from local storage
                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const response = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
                    headers: {
                        Authorization: `Token ${token}`,  // Send the token in headers for authentication
                    },
                });
                setConversations(response.data);  // Store the retrieved conversations in state
            } catch (error) {
                setError('Error fetching conversations');
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);  // Stop loading when data is fetched or an error occurs
            }
        };

        fetchConversations();
    }, []);

    // Handle clicking on a conversation to navigate to the message list
    const handleConversationClick = (conversationId) => {
        navigate(`/conversations/${conversationId}/messages`);
    };

    if (loading) {
        return <p>Loading conversations...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="conversation-list-container">
            <h2>Your Conversations</h2>

            {/* Check if there are conversations */}
            {conversations.length === 0 ? (
                <p>No conversations yet.</p>
            ) : (
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation.id} className="conversation-item">
                            <p>
                                <strong>Participants:</strong> 
                                {conversation.participants && conversation.participants.length > 0 
                                    ? conversation.participants.join(', ') 
                                    : 'No participants found'}
                            </p>

                            {/* View Conversation */}
                            <button onClick={() => handleConversationClick(conversation.id)}>
                                View Messages
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ConversationList;
