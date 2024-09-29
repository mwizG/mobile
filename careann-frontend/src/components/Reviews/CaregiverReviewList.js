// src/components/Reviews/CaregiverReviewList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
} from '@mui/material';

const API_URL = 'http://your-backend-api-url/api/reviews/caregiver/';

function CaregiverReviewList() {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews', error);
                setError('Error fetching reviews. Please try again later.');
            }
        };
        fetchReviews();
    }, []);

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '20px', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom align="center">
                View Reviews
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <List>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <React.Fragment key={review.id}>
                            <ListItem>
                                <ListItemText
                                    primary={<strong>{review.reviewer}</strong>}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                Rated: {review.rating}
                                            </Typography>
                                            <p>{review.review}</p>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))
                ) : (
                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        No reviews available.
                    </Typography>
                )}
            </List>
        </Container>
    );
}

export default CaregiverReviewList;
