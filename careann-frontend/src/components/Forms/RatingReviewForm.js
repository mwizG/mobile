// src/components/Forms/RatingReviewForm.js
import React, { useState } from 'react';
import axios from 'axios';

function RatingReviewForm({ jobId }) {
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/rate/`, {
                rating: rating,
                review: review,
            });
            console.log('Review submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div>
            <h2>Rate and Review Caregiver</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Rating (out of 5)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />
                <textarea
                    placeholder="Write a review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
}

export default RatingReviewForm;
