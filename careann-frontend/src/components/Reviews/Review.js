// src/components/Reviews/Review.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const API_URL = 'http://127.0.0.1:8000/api/jobs/';

function Review() {
    const { jobId } = useParams();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewee, setReviewee] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        }

        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}${jobId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                const jobData = response.data;

                if (role === 'care_seeker') {
                    setReviewee(jobData.caregiver);
                } else {
                    setError('Only care seekers can submit reviews.');
                }
            } catch (error) {
                setError('Error fetching job details.');
            }
        };

        fetchJobDetails();
    }, [jobId, navigate]);

    const submitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const payload = {
                job: jobId,
                rating: rating,
                review: review,
            };

            await axios.post(`${API_URL}reviews/create/`, payload, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            alert('Review submitted successfully!');
            navigate('/care-seeker/listreviews');
        } catch (error) {
            setError('Error submitting the review. Ensure the job is completed.');
        }
    };

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '20px', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom align="center">
                Submit a Review
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}

            {reviewee ? (
                <>
                    <Typography variant="h6">
                        Reviewing: <strong>{reviewee.username}</strong>
                    </Typography>

                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Rating (out of 5)</InputLabel>
                        <Select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            label="Rating (out of 5)"
                        >
                            <MenuItem value={0}>Select Rating</MenuItem>
                            {[1, 2, 3, 4, 5].map((rate) => (
                                <MenuItem key={rate} value={rate}>
                                    {rate}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Review"
                        multiline
                        rows={4}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here..."
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                    />

                    <Button variant="contained" onClick={submitReview} sx={{ mt: 2 }}>
                        Submit Review
                    </Button>
                </>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Loading review information...
                </Typography>
            )}
        </Container>
    );
}

export default Review;
