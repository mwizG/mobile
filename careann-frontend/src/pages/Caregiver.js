// src/pages/Caregiver.js
import React from 'react';
import { Link } from 'react-router-dom';
import CaregiverJobSearch from '../components/Jobs/CaregiverJobSearch';
import AvailabilityForm from '../components/Schedule/AvailabilityForm';
import CaregiverReviewList from '../components/Reviews/CaregiverReviewList';
import CaregiverProfile from '../components/Profile/CaregiverProfile';
import PaymentHistory from '../components/Payments/PaymentHistory';

function CaregiverDashboard() {
    return (
        <div className="dashboard-container">
            <h1>Caregiver Dashboard</h1>
            <p>Welcome to your dashboard. From here, you can search for jobs, manage your availability, view your reviews, manage your profile, and view your earnings.</p>

            <div className="dashboard-options">
                <Link to="/caregiver/search-jobs">
                    <button>Search for Jobs</button>
                </Link>
                <Link to="/caregiver/schedule">
                    <button>Manage Availability</button>
                </Link>
                <Link to="/caregiver/reviews">
                    <button>View Reviews</button>
                </Link>
                <Link to="/caregiver/messaging">
                    <button>Messaging</button>
                </Link>
                <Link to="/caregiver/profile">
                    <button>Manage Profile</button>
                </Link>
                <Link to="/caregiver/payments">
                    <button>View Earnings</button>
                </Link>
            </div>

            <div className="review-management-section">
                <CaregiverReviewList />
            </div>

            <div className="profile-management-section">
                <CaregiverProfile />
            </div>

            <div className="payment-history-section">
                <PaymentHistory />
            </div>
        </div>
    );
}

export default CaregiverDashboard;
