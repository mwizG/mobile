import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Box
} from '@mui/material';

function CaregiverList() {
    const { serviceType } = useParams(); // Get service type from URL
    const [caregivers, setCaregivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from local storage
                const response = await axios.get(`http://127.0.0.1:8000/api/accounts/caregivers/service/${serviceType}/`, {
                    headers: {
                        Authorization: `Token ${token}` // Include token in request headers
                    }
                });
                setCaregivers(response.data);
            } catch (error) {
                console.error("Error fetching caregivers:", error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchCaregivers();
    }, [serviceType]);

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
                    participants: [caregiverUsername]
                }, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                // Navigate to the new conversation's messages
                navigate(`/conversations/${response.data.id}/messages`);
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Caregivers for {serviceType.replace(/-/g, ' ')}
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {caregivers.length > 0 ? (
                        caregivers.map(caregiver => (
                            <Grid item xs={12} sm={6} md={4} key={caregiver.id}>
                                <Card style={{ height: '400px', width: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="200" // Increased height for the image
                                        image={caregiver.profile_image || "default-profile.png"} // Add a default image
                                        alt={caregiver.username}
                                        style={{ objectFit: 'cover' }} // Ensure the image covers the entire area
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{caregiver.username}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {caregiver.bio || "No description available."}
                                        </Typography>
                                        <Typography variant="body2">
                                            Average Rating: {caregiver.average_rating.toFixed(1)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Experience Categories: {caregiver.experience_categories.join(', ') || "None"}
                                        </Typography>
                                        <button onClick={() => startConversation(caregiver.username)}>Message</button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary">
                                No caregivers available for this service type.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
}

export default CaregiverList;
