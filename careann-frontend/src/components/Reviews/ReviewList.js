// src/components/Reviews/ReviewList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewList() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get('http://your-backend-api-url/api/reviews/', {
                    headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews', error);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div>
            <h2>Manage Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <strong>{review.reviewer}</strong> rated <strong>{review.reviewee}</strong> with a {review.rating}:
                        <p>{review.review}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReviewList;
