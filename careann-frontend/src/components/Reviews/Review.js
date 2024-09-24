import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Review() {
    const { jobId } = useParams();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewee, setReviewee] = useState('');  // The person being reviewed (caregiver)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Ensure only care seekers can review caregivers
    useEffect(() => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login'); // Redirect to login if no token
        }

        // Care seekers can review caregivers, so we fetch job details to get caregiver info
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                const jobData = response.data;

                // Only care seekers can review, so the reviewee is the caregiver
                if (role === 'care_seeker') {
                    setReviewee(jobData.caregiver);
                } else {
                    // If the user is not a care seeker, redirect or show an error
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

            console.log("Submitting review payload:", payload);

            await axios.post('http://127.0.0.1:8000/api/jobs/reviews/create/', payload, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            alert('Review submitted successfully!');
            navigate('/care-seeker/listreviews');  // Redirect to the review list after submission
        } catch (error) {
            setError('Error submitting the review. Ensure the job is completed.');
        }
    };

    return (
        <div className="review-container">
            <h2>Submit a Review</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reviewee ? (
                <>
                    <p>Reviewing: <strong>{reviewee}</strong></p>

                    <label>
                        Rating (out of 5):
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="0">Select Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Review:
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review here..."
                        />
                    </label>
                    <br />
                    <button onClick={submitReview}>Submit Review</button>
                </>
            ) : (
                <p>Loading review information...</p>
            )}
        </div>
    );
}

export default Review;
