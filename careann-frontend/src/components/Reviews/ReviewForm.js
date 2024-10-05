// src/components/Reviews/ReviewForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ReviewForm({ jobId }) {
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken'); 
            await axios.post(`http://your-backend-api-url/api/jobs/${jobId}/review/`, {
                rating,
                review
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                placeholder="Rating (1-5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <textarea
                placeholder="Write your review here"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <button type="submit">Submit Review</button>
        </form>
    );
}

export default ReviewForm;
