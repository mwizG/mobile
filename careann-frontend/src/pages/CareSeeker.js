// src/pages/CareSeeker.js
import React from 'react';
import { Link } from 'react-router-dom';
import SearchCaregiversForm from '../components/Forms/SearchCaregiversForm';
import JobPostingForm from '../components/Jobs/JobPostingForm';
import ReviewList from '../components/Reviews/ReviewList';
import PaymentForm from '../components/Payments/PaymentForm';

function CareSeekerDashboard() {
    const jobId = 1; // Example job ID, replace with dynamic data
    const caregiverId = 2; // Example caregiver ID, replace with dynamic data

    return (
        <div className="dashboard-container">
            <h1>Care Seeker Dashboard</h1>
            <p>Welcome to your dashboard. From here, you can search for caregivers, post job listings, manage your reviews, and make payments.</p>

            <div className="dashboard-options">
                <Link to="/care-seeker/search">
                    <button>Search for Caregivers</button>
                </Link>
                <Link to="/care-seeker/post-job">
                    <button>Post a Job</button>
                </Link>
                <Link to="/care-seeker/reviews">
                    <button>Manage Reviews</button>
                </Link>
                <Link to="/care-seeker/messaging">
                    <button>Messaging</button>
                </Link>
            </div>

            <div className="payment-section">
                <PaymentForm jobId={jobId} caregiverId={caregiverId} />
            </div>
        </div>
    );
}

export default CareSeekerDashboard;
