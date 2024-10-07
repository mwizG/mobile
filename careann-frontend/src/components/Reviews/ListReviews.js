import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Grid,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const API_URL = 'http://127.0.0.1:8000/api/jobs/reviews/';

function ListReviews() {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReviews(response.data);
            } catch (error) {
                setError('Error fetching reviews.');
            }
        };

        fetchReviews();
    }, []);

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#388e3c', fontWeight: 'bold', textAlign: 'center' }}>
                Received Reviews
            </Typography>
            {reviews.length === 0 ? (
                <Typography sx={{ color: '#555', textAlign: 'center', fontStyle: 'italic' }}>
                    No reviews received yet.
                </Typography>
            ) : (
                <List>
                    {reviews.map((review) => (
                        <Paper 
                            key={review.id}
                            elevation={3} 
                            sx={{ 
                                margin: '15px 0', 
                                padding: '15px',
                                borderRadius: '8px', 
                                boxShadow: 2, // Add a more pronounced shadow for depth
                                backgroundColor: '#ffffff' // White background for each review tile
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <ListItemText
                                        primary={<strong style={{ color: '#388e3c' }}>Reviewer:</strong>}
                                        secondary={review.reviewer}
                                    />
                                    <ListItemText
                                        primary={<strong style={{ color: '#388e3c' }}>Job:</strong>}
                                        secondary={review.job_title}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="center">
                                    <Typography variant="h6" sx={{ color: '#388e3c', display: 'flex', alignItems: 'center' }}>
                                        <Star sx={{ color: '#ffb300', marginRight: '5px' }} />
                                        {review.rating}/5
                                    </Typography>
                                </Grid>
                            </Grid>
                            <ListItem>
                                <ListItemText
                                    primary={<strong style={{ color: '#388e3c' }}>Review:</strong>}
                                    secondary={review.review}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={<strong style={{ color: '#388e3c' }}>Date:</strong>}
                                    secondary={new Date(review.created_at).toLocaleDateString()}
                                />
                            </ListItem>
                            <Divider sx={{ margin: '10px 0' }} />
                        </Paper>
                    ))}
                </List>
            )}
        </Container>
    );
}

export default ListReviews;
