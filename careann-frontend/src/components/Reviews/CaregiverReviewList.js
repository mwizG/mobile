// src/components/Reviews/CaregiverReviewList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CaregiverReviewList() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://your-backend-api-url/api/reviews/caregiver/', {
                    headers: {
                        Authorization: `Token ${token}`,
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
            <h2>View Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <strong>{review.reviewer}</strong> rated you with a {review.rating}:
                        <p>{review.review}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CaregiverReviewList;
