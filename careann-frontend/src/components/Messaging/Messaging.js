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
    const [loadingMessages, setLoadingMessages] = useState(true); // Loading state for messages
    const socketRef = useRef(null); // Use ref to store WebSocket instance

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

                const savedConversationId = localStorage.getItem('selectedConversation');
                if (savedConversationId) {
                    handleSelectConversation(savedConversationId);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();

        // Clean up WebSocket connection on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const handleSelectConversation = (conversationId) => {
        if (selectedConversation === conversationId) return; // Prevent re-initializing same conversation

        setSelectedConversation(conversationId);
        localStorage.setItem('selectedConversation', conversationId);

        // Close any existing socket connection
        if (socketRef.current) {
            socketRef.current.close();
        }

        // Establish a new WebSocket connection for the selected conversation
        const token = localStorage.getItem('token');
        socketRef.current = new WebSocket(`ws://127.0.0.1:8001/ws/messaging/${conversationId}/?token=${token}`);

        // Handle incoming WebSocket messages
        socketRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        // Handle WebSocket errors
        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Fetch messages for the selected conversation initially
        fetchMessages(conversationId);
    };

    const fetchMessages = async (conversationId) => {
        setLoadingMessages(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/api/messaging/conversations/${conversationId}/messages/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = () => {
        if (socketRef.current && newMessage.trim()) {
            const messageData = {
                content: newMessage,
                conversation: selectedConversation,
            };
            
            // Log the message data being sent
            console.log('Sending message data:', JSON.stringify(messageData));
            
            socketRef.current.send(JSON.stringify(messageData));
            setNewMessage('');
        }
    };
    

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
                                    onClick={() => handleSelectConversation(conversation.id)}
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
                                {loadingMessages ? (
                                    <CircularProgress />
                                ) : (
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
                                )}
                            </div>
                            <div style={{ display: 'flex', marginTop: 2 }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Type a message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{ flex: 1, marginRight: 2 }}
                                />
                                <Button variant="contained" onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </div>
                        </Paper>
                    ) : (
                        <Typography variant="body2">Select a conversation to start chatting!</Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Messaging;
