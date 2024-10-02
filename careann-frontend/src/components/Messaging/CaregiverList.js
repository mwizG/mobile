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

function CaregiverList() {
    const [caregivers, setCaregivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/messaging/caregivers/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setCaregivers(response.data);
            } catch (error) {
                console.error('Error fetching caregivers:', error);
                setError('Failed to load caregivers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCaregivers();
    }, []);

    const startConversation = async (caregiverUsername) => {
        try {
            const token = localStorage.getItem('token');

            // Fetch existing conversations
            const conversationsResponse = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            // Check if a conversation with the caregiver already exists
            const existingConversation = conversationsResponse.data.find(conversation =>
                conversation.participants.includes(caregiverUsername)
            );

            if (existingConversation) {
                // Navigate to the existing conversation
                navigate(`/conversations/${existingConversation.id}/messages`);
            } else {
                // Start a new conversation if none exists
                const response = await axios.post('http://127.0.0.1:8000/api/messaging/conversations/', {
                    participants: [caregiverUsername],
                }, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Navigate to the new conversation's messages
                navigate(`/conversations/${response.data.id}/messages`);
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading caregivers...</Typography>
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
                Caregivers
            </Typography>
            <Grid container spacing={3}>
                {caregivers.map(caregiver => (
                    <Grid item xs={12} sm={6} md={4} key={caregiver.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {caregiver.username}
                                </Typography>
                                {/* Add additional information if available */}
                                {/* <Typography variant="body2">
                                    Additional info: {caregiver.additionalInfo}
                                </Typography> */}
                            </CardContent>
                            <CardActions sx={{ mt: 'auto' }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => startConversation(caregiver.username)}
                                    fullWidth
                                >
                                    Message
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default CaregiverList;
