// src/components/Dashboard/CaregiverDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function CaregiverDashboard() {
    return (
        <div className="dashboard-container">
            <h1>Caregiver Dashboard</h1>
            <p>Welcome to your dashboard. From here, you can search for jobs, manage your availability, and view your reviews.</p>

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
            </div>
        </div>
    );
}

export default CaregiverDashboard;
