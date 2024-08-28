// src/components/CaregiverReviews.js
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/Api';

function CaregiverReviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    caregiverId: '',
    rating: '',
    review: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiGet('/reviews/');  // Fetch existing reviews for caregivers
        setReviews(data);
      } catch (err) {
        setError('Failed to load reviews');
      }
    };
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiPost('/reviews/', newReview);  // Submit a new review
      setSuccess('Review submitted successfully');
      setNewReview({ caregiverId: '', rating: '', review: '' });  // Clear the form
      const updatedReviews = await apiGet('/reviews/');  // Refresh the list of reviews
      setReviews(updatedReviews);
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <div className="reviews-container">
      <h2>Manage Reviews</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Caregiver ID</label>
          <input
            type="text"
            name="caregiverId"
            value={newReview.caregiverId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={newReview.rating}
            onChange={handleChange}
            min="1"
            max="5"
          />
        </div>
        <div>
          <label>Review</label>
          <textarea
            name="review"
            value={newReview.review}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </form>

      <div className="reviews-list">
        <h3>Existing Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p>
                <strong>Caregiver ID:</strong> {review.caregiverId}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p>
                <strong>Review:</strong> {review.review}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews found</p>
        )}
      </div>
    </div>
  );
}

export default CaregiverReviews;
