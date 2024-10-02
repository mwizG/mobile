import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';

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
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading conversations...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Conversations
            </Typography>

            {/* Check if there are conversations */}
            {conversations.length === 0 ? (
                <Typography variant="body1">No conversations yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {conversations.map((conversation) => (
                        <Grid item xs={12} sm={6} md={4} key={conversation.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        Participants
                                    </Typography>
                                    <Typography variant="body2">
                                        {conversation.participants && conversation.participants.length > 0 
                                            ? conversation.participants.join(', ') 
                                            : 'No participants found'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleConversationClick(conversation.id)} 
                                        fullWidth
                                    >
                                        View Messages
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default ConversationList;
