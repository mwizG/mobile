import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Typography,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Paper,
} from '@mui/material';

const Messaging = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

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
            }, 5000);

            return () => clearInterval(intervalId);
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
        <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', height: '80vh' }}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={4} sx={{ borderRight: '1px solid #ccc', padding: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Your Conversations
                    </Typography>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {conversations.map((conversation) => (
                                <ListItem 
                                    button 
                                    key={conversation.id} 
                                    onClick={() => fetchMessages(conversation.id)} 
                                    sx={{ backgroundColor: selectedConversation === conversation.id ? '#f0f0f0' : 'inherit' }}
                                >
                                    <ListItemText primary={`Conversation with ${conversation.participants.join(', ')}`} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
                <Grid item xs={8} sx={{ padding: 2 }}>
                    {selectedConversation ? (
                        <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Messages
                            </Typography>
                            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '60vh' }}>
                                <List>
                                    {messages.length === 0 ? (
                                        <Typography variant="body2">No messages yet.</Typography>
                                    ) : (
                                        messages.map((message) => (
                                            <ListItem key={message.id}>
                                                <ListItemText 
                                                    primary={<strong>{message.sender}:</strong>} 
                                                    secondary={message.content} 
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                    <div ref={messageEndRef}></div>
                                </List>
                            </div>
                            <div style={{ display: 'flex', marginTop: 2 }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Type a message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    sx={{ flex: 1, marginRight: 2 }}
                                />
                                <Button variant="contained" onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </div>
                        </Paper>
                    ) : (
                        <Typography variant="body2">Select a conversation to view messages</Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default Messaging;
