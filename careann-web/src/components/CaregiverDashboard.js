import React from 'react';
import { Link } from 'react-router-dom';

function CaregiverDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Caregiver Dashboard</h1>
      <p>Welcome to your dashboard. From here, you can search for jobs, manage your availability, review your applications, and view your messages.</p>

      <div className="dashboard-options">
        <Link to="/caregiver/search-jobs" className="dashboard-option">
          <button>Search for Jobs</button>
        </Link>
        <Link to="/caregiver/schedule" className="dashboard-option">
          <button>Manage Availability</button>
        </Link>
        <Link to="/caregiver/reviews" className="dashboard-option">
          <button>View Reviews</button>
        </Link>
        <Link to="/messaging" className="dashboard-option">
          <button>View Messages</button>
        </Link>
        <Link to="/" className="dashboard-option">
          <button>Home</button>
        </Link>
        <div className="home-options">
        <Link to="/caregiver/jobs" className="home-option">
        <button>View Job Listings</button>
        </Link>
        </div>
      </div>
    </div>
  );
}

export default CaregiverDashboard;
