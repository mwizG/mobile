import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

                const response = await axios.get('http://127.0.0.1:8000/api/jobs/reviews/', {
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
        return <div>{error}</div>;
    }

    return (
        <div className="reviews-container">
            <h2>Received Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews received yet.</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            <p><strong>Reviewer:</strong> {review.reviewer}</p>
                            <p><strong>Rating:</strong> {review.rating}/5</p>
                            <p><strong>Review:</strong> {review.review}</p>
                            <p><strong>Date:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListReviews;
