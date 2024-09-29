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
    Box,
} from '@mui/material';

const API_URL = 'http://127.0.0.1:8000/api/jobs/reviews/';

function ListReviews() {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Token ${token}`,
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
        <Container component={Paper} elevation={3} sx={{ padding: '20px', marginTop: '20px', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                Received Reviews
            </Typography>
            {reviews.length === 0 ? (
                <Typography sx={{ color: '#555' }}>No reviews received yet.</Typography>
            ) : (
                <List>
                    {reviews.map((review) => (
                        <div key={review.id}>
                            <ListItem sx={{ bgcolor: '#f1f8e9', borderRadius: '8px', margin: '10px 0' }}>
                                <ListItemText
                                    primary={<strong style={{ color: '#388e3c' }}>Reviewer:</strong>}
                                    secondary={review.reviewer}
                                />
                                <ListItemText
                                    primary={<strong style={{ color: '#388e3c' }}>Job:</strong>}
                                    secondary={review.job_title}
                                />

                                <ListItemText
                                    primary={<strong style={{ color: '#388e3c' }}>Rating:</strong>}
                                    secondary={`${review.rating}/5`}
                                />
                            </ListItem>
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
                            <Divider />
                        </div>
                    ))}
                </List>
            )}
        </Container>
    );
}

export default ListReviews;
