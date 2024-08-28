import React from 'react';
import { Link } from 'react-router-dom';

function CareSeekerDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Care Seeker Dashboard</h1>
      <p>Welcome to your dashboard. From here, you can search for caregivers, post job listings, manage your reviews, and view your messages.</p>

      <div className="dashboard-options">
        <Link to="/care-seeker/search" className="dashboard-option">
          <button>Search for Caregivers</button>
        </Link>
        <Link to="/care-seeker/post-job" className="dashboard-option">
          <button>Post a Job</button>
        </Link>
        <Link to="/care-seeker/reviews" className="dashboard-option">
          <button>Manage Reviews</button>
        </Link>
        <Link to="/messaging" className="dashboard-option">
          <button>View Messages</button>
        </Link>
        <Link to="/" className="dashboard-option">
          <button>Home</button>
        </Link>
        
      </div>
    </div>
  );
}

export default CareSeekerDashboard;
